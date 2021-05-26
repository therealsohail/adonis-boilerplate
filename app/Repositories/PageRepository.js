'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')
const _ = require('lodash')

class PageRepository extends BaseRepository {
    model

    constructor(model) {
        super(model)
        this.model = model
    }

    async store(request, response) {
        let input = request.only(this.model.fillable)
        input.slug = _.kebabCase(input.title);
        return await super.store(input, response);
    }

    async update(id, request) {
        let input = request.only(this.model.fillable)
        input.slug = _.kebabCase(input.title);
        return await this.model.query().where('id', id).update(input)
    }


}

ioc.singleton('PageRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'Page')
    return new PageRepository(model)
})

module.exports = ioc.use('PageRepository')