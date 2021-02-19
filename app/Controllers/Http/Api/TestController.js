'use strict'

const TestRepo = use('App/Repositories/TestRepository')
const BaseController = use('BaseController')
const Config = use('Config')

class TestController extends BaseController {

    constructor() {
        super(TestRepo)
    }

    //Get all records
    async index(ctx) {

        /*Accept optional params
        * orderBy = col
        * sortBy = asc or desc
        * limit = int
        * offset = int
        * */

        let offset = ctx.request.input('offset', 1)
        let limit = ctx.request.input('limit', Config.get('constants.limit'))
        let orderBy = ctx.request.input('orderBy', 'id')
        let sortBy = ctx.request.input('sortBy', 'desc')
        let res = await TestRepo.index(offset,limit,orderBy,sortBy)
        return ctx.response.json(this.globalResponse(true, "Record fetched successfully!", res.toJSON()))
    }

    //Show single record
    async show(ctx) {
        const res = await TestRepo.show(ctx.request.params.id)
        return ctx.response.json(this.globalResponse(true, "Record fetched successfully!", res ? res.toJSON() : {}))
    }

    //Save a record
    async store(ctx) {
        let input = ctx.request.except(['password_confirmation','_csrf','_method'])
        let res = await TestRepo.store(input, ctx.request)
        return ctx.response.json(this.globalResponse(true, "Record created successfully!", res))
    }

    //Update a record
    async update(ctx) {
        const input = ctx.request.all()
        let res = await TestRepo.update(ctx.request.params.id, input)
        if (!res){
            return ctx.response.json(this.globalResponse(false, "Record not found!",{}))
        }else{
            return ctx.response.json(this.globalResponse(true, "Record updated successfully!", res))
        }
    }

    /*Delete a record*/
    async destroy(ctx) {
        const res = await TestRepo.destroy(ctx.request.params.id)
        if(!res){
            return ctx.response.json(this.globalResponse(false, "Record not found!", {}))
        }else{
            return ctx.response.json(this.globalResponse(true, "Record deleted successfully!", {}))
        }
    }

}

module.exports = TestController