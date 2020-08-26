'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')
const myHelpers = use('myHelpers')

class UserRepository extends BaseRepository {

    #model

    constructor(model) {
        super(model)
        this.#model = model
    }

    async store(request, response) {
        let input = request.only(['username', 'email', 'password', 'image', 'address', 'is_verified', 'is_approved'])
        if (request.file('image')) {
            const file = request.file('image', {types: ['image']})
            input.image = await myHelpers.uploadImage(file, 'users/');
        }
        input.is_verified = 1;
        input.is_approved = 1;
        return await super.store(input, response);
    }

    async findByEmail(email) {
        let user = await this.#model.query().where('email', email).first();
        return user;
    }

    async show(id) {
        let user = await this.#model.find(id);
        return user;
    }

    deleteAllUsers = () => this.#model.deleteMany({})

}

ioc.singleton('UserRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'User')
    return new UserRepository(model)
})

module.exports = ioc.use('UserRepository')
