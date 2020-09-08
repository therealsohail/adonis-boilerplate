'use strict'

const userRepo = use('App/Repositories/UserRepository')
const userDeviceRepo = use('App/Repositories/UserDeviceRepository')
const roleRepo = use('App/Repositories/RoleRepository')
const BaseController = use('BaseController')
const Role = use('App/Models/Sql/Role')
const myHelpers = use('myHelpers')
const Mail = use('Mail')
const Env = use('Env')
const Hash = use('Hash')

class UserController extends BaseController {

    constructor() {
        super(userRepo)
    }

    async register({request, response, auth}) {
        try {
            let user = await userRepo.store(request, response)
            request._all.user_id = user.id;
            await user.roles().attach([Role.USER]);
            await userDeviceRepo.store(request, response)
            return this.respondWithToken(user, auth, response, 'Registered Successfully.')
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }

    }

    async login({request, auth, response}) {

        let {email, password} = request.all();

        try {
            if (await auth.authenticator('jwt').attempt(email, password)) {
                let user = await userRepo.findByEmail(email)
                return this.respondWithToken(user, auth, response, 'Login Successfully.')
            }
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async socialLogin({request, auth, response}) {
        try {
            let user = await userRepo.findSocialLogin(request)
            if (user == null) {
                user = await userRepo.findByEmail(request.input('email'));
                if (user == null) {
                    user = await userRepo.socialLogin(request, response)
                } else {
                    return response.status(403).json({status: false, error: "Email already exists"})
                }
            }
            request._all.user_id = user.id;
            await user.roles().attach([Role.USER]);
            await userDeviceRepo.store(request, response)
            return this.respondWithToken(user, auth, response, 'Login Successfully.')

        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async forgotPassword({request, response}) {
        try {
            let user = await userRepo.findByEmail(request.input('email'));
            if (user == null) {
                return response.status(403).json({status: false, error: "no user found"})
            }
            let verification_code = Math.floor(1000 + Math.random() * 9000);
            Mail.send('mails.verify', {verification_code}, (message) => {
                message
                    .to(user.email)
                    .from(Env.get('MAIL_FROM_ADDRESS'), Env.get('MAIL_FROM_NAME'))
                    .subject('Forgot Password Verification Code')
            })
            await userRepo.updateVerificationCode(verification_code)
            user.verification_code = verification_code;
            await user.save();
            return response.json({status: true, message: "Verification Code Send To Your Email"})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async verifyOTP({request, response}) {
        try {
            let user = await userRepo.model.query().where({'verification_code': request.input('verification_code')}).first()
            if (user == null) {
                return response.status(403).json({
                    status: false,
                    error: "Code Is Invalid"
                })
            }
            return response.json({status: true, message: "Verified"})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async resetPassword({request, response}) {
        try {
            let user = await userRepo.model.query().where({
                'email': request.input('email'),
                'verification_code': request.input('verification_code')
            }).first()
            if (user == null) {
                return response.status(403).json({
                    status: false,
                    error: "Code Is Invalid"
                })
            }
            user.password = request.input('password')
            user.verification_code = null
            await user.save()
            return response.json({status: true, message: "Password Changed Successfully"})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async changePassword({request, auth, response}) {
        try {
            let user = auth.user
            let verify = await Hash.verify(request.input('current_password'), user.password)
            if (!verify) {
                return response.status(403).json({status: false, error: "Wrong password"})
            }
            user.password = request.input('password')
            await user.save()
            return response.json({status: true, message: "Password Changed Successfully"})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }
    }

    async respondWithToken(user, auth, response, message) {
        try {
            let token = await auth.authenticator('jwt').withRefreshToken().generate(user)
            Object.assign(user, {access_token: token})
            return response.json({status: true, data: user, message: message})
        } catch (e) {
            return response.status(403).json({status: false, error: e.message})
        }

    }

    async refreshToken({auth, request, response}) {
        try {
            let input = await request.only('refresh_token');
            let token = await auth.authenticator('jwt').newRefreshToken().generateForRefreshToken(input.refresh_token, true)
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
