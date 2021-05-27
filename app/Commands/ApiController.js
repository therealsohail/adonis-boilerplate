'use strict'

class ApiController {


    constructor(args, options) {
        this.args = args
        this.options = options
    }

    apiControllerContent() {
        return `'use strict'

const ${this.args.name}Repo = use('App/Repositories/${this.args.name}Repository')
const BaseController = use('BaseController')
const Config = use('Config')

class ${this.args.name}Controller extends BaseController {

    constructor() {
        super(${this.args.name}Repo)
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
        let res = await ${this.args.name}Repo.index(offset,limit,orderBy,sortBy)
        return ctx.response.json(this.globalResponse(true, "Record fetched successfully!", res))
    }

    //Show single record
    async show(ctx) {
        const res = await ${this.args.name}Repo.show(ctx.request.params.id)
        return ctx.response.json(this.globalResponse(true, "Record fetched successfully!", res))
    }

    //Save a record
    async store(ctx) {
        let input = ctx.request.only(${this.args.name}Repo.model.fillable)
        let res = await ${this.args.name}Repo.store(input, ctx.request)
        return ctx.response.json(this.globalResponse(true, "Record created successfully!", res))
    }

    //Update a record
    async update(ctx) {
        const input = ctx.request.only(${this.args.name}Repo.model.fillable)
        let res = await ${this.args.name}Repo.update(ctx.request.params.id, input)
        if (!res){
            return ctx.response.json(this.globalResponse(false, "Record not found!"))
        }else{
            return ctx.response.json(this.globalResponse(true, "Record updated successfully!", res))
        }
    }

    /*Delete a record*/
    async destroy(ctx) {
        const res = await ${this.args.name}Repo.destroy(ctx.request.params.id)
        if(!res){
            return ctx.response.json(this.globalResponse(false, "Record not found!"))
        }else{
            return ctx.response.json(this.globalResponse(true, "Record deleted successfully!"))
        }
    }

}

module.exports = ${this.args.name}Controller`
    }
}

module.exports = ApiController