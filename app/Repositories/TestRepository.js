'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class TestRepository extends BaseRepository {
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

    async store(input, file=null){
        let res = await this.model.create(input)

        /*For file upload*/
        if (file){
            /*todoo file upload here*/
        }

        return res
    }

    async update(id, input, file=null){
        let modelObj = await this.model.find(id)

        //check if the row related to this id exists
        if (!modelObj) {
            return null
        }

        /*FILE UPLOAD*/
        if(file){
            /*todoo file upload here*/
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

ioc.singleton('TestRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'Test')
    return new TestRepository(model)
})

module.exports = ioc.use('TestRepository')