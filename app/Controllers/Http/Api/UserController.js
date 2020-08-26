'use strict'

const userRepo = use('App/Repositories/UserRepository')
const userDeviceRepo = use('App/Repositories/UserDeviceRepository')
const BaseController = use('BaseController')
const myHelpers = use('myHelpers')

class UserController extends BaseController {

    constructor() {
        super(userRepo)
    }

    async register({request, response, auth}) {
        try {
            let user = await userRepo.store(request, response)
            request._all.user_id = user.id;
            await userDeviceRepo.store(request, response)
            return this.respondWithToken(user, auth, response, 'Registered Successfully.')
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }

    }

    async login({request, auth, response}) {

        let {email, password} = request.all();

        try {
            if (await auth.attempt(email, password)) {
                let user = await userRepo.findByEmail(email)
                return this.respondWithToken(user, auth, response, 'Login Successfully.')
            }
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async respondWithToken(user, auth, response, message) {
        try {
            let token = await auth.withRefreshToken().generate(user)
            Object.assign(user, {access_token: token})
            return response.json({status: true, data: user, message: message})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }

    }

    async refreshToken({auth, request, response}) {
        try {
            let input = await request.only('refresh_token');
            let token = await auth.newRefreshToken().generateForRefreshToken(input.refresh_token, true)
            const parsedJWT = await auth.authenticator('jwt')._verifyToken(token.token)
            const user = await userRepo.show(parsedJWT.uid)
            return this.respondWithToken(user, auth, response, 'Refreshed Successfully.');
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async testNotification() {
        return await myHelpers.sendNotification(null, 'Hello World', {}, ['efQatFVG2Sc:APA91bH0F9N0h7kCN3kZWslOAIBejLrouk1rBNCQfkkp0xtwG5zrPNAb-lPsfXNEB6By1rbpIVP8BEGD-lHMYwcNdPKZg0uGs9F1gZGyduSRSlw1Glm6WNjuku-laMkzKtxiSqExvvS-'])
    }

    /*DELETE ALL USERS FROM DATABASE*/
    deleteAllUsers = () => userRepo.deleteAllUsers()

    addUser = ({request, response}) => userRepo.addUser(request, response)

}

module.exports = UserController
