'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class UserRepository extends BaseRepository {

    #model

    constructor(model) {
        super(model)
        this.#model = model
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
