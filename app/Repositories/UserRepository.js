'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Role = use('App/Models/Sql/Role')
const Config = use('Config')
const myHelpers = use('myHelpers')
const User = use('App/Models/Sql/User')
const Hash = use('Hash')
const ExceptionWithCode = use('App/Exceptions/ExceptionWithCode')
const Mail = use('Mail')
const Env = use('Env')

class UserRepository extends BaseRepository {

    model

    constructor(model) {
        super(model)
        this.model = model
    }

    async store(request, response) {
        let input = request.only(User.fillable)
        if (request.file('image')) {
            const file = request.file('image', {types: ['image']})
            input.image = await myHelpers.uploadImage(file, 'users/')
        }
        input.is_verified = 1
        input.is_approved = 1
        return await super.store(input, response);
    }

    async update(id, request) {
        let input = request.only(User.fillable)
        if (request.file('image')) {
            const file = request.file('image', {types: ['image']})
            input.image = await myHelpers.uploadImage(file, 'users/');
        }
        if (input.password != null) {
            input.password = await Hash.make(input.password)
        } else {
            delete input.password;
        }
        return await this.model.query().where('id', id).update(input)
    }

    async socialLogin(request, response) {
        let input = request.only(['username', 'email', 'image', 'address', 'is_verified', 'is_approved', 'social_platform', 'client_id', 'token'])
        input.is_verified = 1;
        input.is_approved = 1;
        input.is_social_login = 1;
        input.password = Math.random().toString(36).substring(2, 15)
        return await super.store(input, response);
    }

    async findByEmail(email) {
        let user = await this.model.query().where('email', email).first();
        return user;
    }

    async findSocialLogin(request) {
        let user = await this.model.query().where({
            social_platform: request.input('social_platform'),
            client_id: request.input('client_id'),
        }).first();
        return user;
    }

    async show(id) {
        let user = await this.model.find(id);
        return user;
    }

    async updateVerificationCode(user,verification_code) {
        return await this.model.query().where('id', user.id).update({verification_code});
    }

    async getUsers() {
        let users = await this.model.query().whereHas('roles', (builder) => {
            builder.where('id', Role.USER)
        }).fetch()
        return users.toJSON();
    }

    async generateAndSendOTP(email) {
        /*Generate OTP*/
        let otp_code = Math.floor(1000 + Math.random() * 9000);

        let user = await this.findByEmail(email)

        if (!user)
            throw new ExceptionWithCode("Email does not exist!", 404)

        user.verification_code = otp_code
        await user.save()

        /*Send Email*/
        await Mail.send('mails.verification-code', {otp_code, name: user.username}, (message) => {
            message
                .to(user.email)
                .from(Env.get('MAIL_FROM_ADDRESS'), Env.get('MAIL_FROM_NAME'))
                .subject('Verification code')
        })
    }

}

ioc.singleton('UserRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'User')
    return new UserRepository(model)
})

module.exports = ioc.use('UserRepository')
