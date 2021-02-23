'use strict'

const userRepo = use('App/Repositories/UserRepository')
const UserDeviceRepo = use('App/Repositories/UserDeviceRepository')
const roleRepo = use('App/Repositories/RoleRepository')
const BaseController = use('BaseController')
const Role = use('App/Models/Sql/Role')
const myHelpers = use('myHelpers')
const Mail = use('Mail')
const Env = use('Env')
const Hash = use('Hash')
const moment = use('moment')

class UserController extends BaseController {

    constructor() {
        super(userRepo)
    }

    async dashboard(ctx){
        let data = {}
        data.total_users = (await userRepo.model.query().getCount()).toString()
        data.new_users = (await userRepo.model.query().whereRaw(`DATE(created_at) = '${moment(new Date()).format('YYYY-MM-DD')}'`).getCount()).toString()
        data.ios = (await UserDeviceRepo.model.query().where({device_type:'ios'}).getCount()).toString()
        data.android = (await UserDeviceRepo.model.query().where({device_type:'android'}).getCount()).toString()
        data.title = "Dashboard"
        return ctx.view.render('admin.dashboard', data)
    }

    async login({request, auth, response, view, session}) {
        session.flashOnly(['email'])
        let {email, password} = request.all();
        try {
            let user = await userRepo.findByEmail(email)
            user = await user.roles().where('id', 1).first()
            if (user == null) {
                await session.flash({error: 'User Not allowed!'})
                return response.redirect('back')
            }
            if (await auth.attempt(email, password)) {
                return response.route('admin.dashboard')
            }
        } catch (e) {
            await session.flash({error: e.message})
            return response.redirect('back')
        }
    }

    async index({response, view}) {
        let data = {}
        let users = await userRepo.getUsers();
        data.users = users
        data.title = "Users"
        return view.render('admin.users.index', data)
    }

    async create({response, view}) {
        let roles = await roleRepo.model.all();
        return view.render('admin.users.create', {
            title: "Create User",
            'roles': roles.toJSON()
        })
    }

    async store({response, view, request, session}) {
        let input = await request.only('roles')
        let user = await userRepo.store(request, response)
        await user.roles().attach(input.roles);
        await session.flash({success: 'User created successfully!'})
        return response.redirect('/admin/users');

    }

    async show({response, view, request, session}) {
        let id = request.params.id;
        let user = await userRepo.model.find(id);
        if (user == null) {
            await session.flash({error: 'User not found'})
            return response.redirect('back')
        }
        return view.render('admin.users.show', {user: user.toJSON(), title: "User Profile"})
    }

    async edit({response, view, request, session}) {
        let id = request.params.id;
        let user = await userRepo.model.find(id);
        if (user == null) {
            await session.flash({error: 'User not found'})
            return response.redirect('back')
        }
        let roles = await roleRepo.model.all();
        let role_ids = await user.roles().ids();
        return view.render('admin.users.edit', {
            user: user.toJSON(),
            title: "Edit User",
            'roles': roles.toJSON(),
            'role_ids': role_ids
        })
    }

    async update({response, view, request, session}) {
        let id = request.params.id;
        let user = await userRepo.model.find(id);
        if (user == null) {
            await session.flash({error: 'User not found'})
            return response.redirect('back')
        }
        user = await userRepo.update(id, request)
        await session.flash({success: 'User updated successfully!'})
        return response.redirect('/admin/users');

    }

    async destroy({response, request, session}) {
        let id = request.params.id;
        let user = await userRepo.model.find(id);
        if (user == null) {
            await session.flash({error: 'User not found'})
            return response.redirect('back')
        }
        await user.delete();
        await session.flash({success: 'User Deleted Successfully!'})
        return response.redirect('/admin/users')
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
            await userRepo.updateVerificationCode(user,verification_code)
            // user.verification_code = verification_code;
            // await user.save();
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


    async test() {
        await myHelpers.sendNotificationToUser("Invitation", "Hello", 48)
    }

    /*DELETE ALL USERS FROM DATABASE*/
    deleteAllUsers = () => userRepo.deleteAllUsers()

    addUser = ({request, response}) => userRepo.addUser(request, response)

}

module.exports = UserController
