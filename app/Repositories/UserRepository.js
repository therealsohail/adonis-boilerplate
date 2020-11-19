'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Role = use('App/Models/Sql/Role')
const Config = use('Config')
const myHelpers = use('myHelpers')
const User = use('App/Models/Sql/User')
const Hash = use('Hash')

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
            input.image = await myHelpers.uploadImage(file, 'users/');
        }
        input.is_verified = 1;
        input.is_approved = 1;
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

    deleteAllUsers = () => this.model.deleteMany({})

}

ioc.singleton('UserRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'User')
    return new UserRepository(model)
})

module.exports = ioc.use('UserRepository')
