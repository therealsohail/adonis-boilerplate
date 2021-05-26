'use strict'

class ApiRepository {


    constructor(args, options) {
        this.args = args
        this.options = options
    }

    apiRepoContent() {
        return `'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class ${this.args.name}Repository extends BaseRepository {
    model

    constructor(model) {
        super(model)
        this.model = model
    }

    async index(offset = 1, limit = Config.get('constants.limit'), orderBy = 'id', sortBy = 'desc') {
        return await this.model.query().orderBy(orderBy, sortBy).paginate(parseInt(offset), parseInt(limit))
    }

    async show(id) {
        return await this.model.find(id)
    }

    async store(input, request=null){
        if (request && request.file('image')) {
            const file = request.file('image', {types: ['image']})
            input.image = await myHelpers.uploadFile(file, 'users/')
        }
        input.is_verified = 1
        input.is_approved = 1
        return await super.store(input, response);
    }

    async update(id, input, request=null){
        let modelObj = await this.model.find(id)

        //check if the row related to this id exists
        if (!modelObj) {
            return null
        }

        /*FILE UPLOAD*/
        if (request && request.file('image')) {
            const file = request.file('image', {types: ['image']})
            input.image = await myHelpers.uploadFile(file, 'users/')
        }

        //assigning input data in db fields
        await this.model.query().where({id}).update(input)
        return await this.model.find(id)
    }

    async destroy(id){
        let modelObj = await this.model.find(id)

        //check if the row related to this id exists
        if (modelObj) {
            return await modelObj.delete()
        }
    }

}

ioc.singleton('${this.args.name}Repository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + '${this.args.name}')
    return new ${this.args.name}Repository(model)
})

module.exports = ioc.use('${this.args.name}Repository')`
    }
}

module.exports = ApiRepository