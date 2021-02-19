'use strict'

const _ = require('lodash')
const Config = use('Config')
class _SqlOperations {

    constructor(model) {
        this.model = model
        this.noRecordFound = 'No record found'
    }

    //Get all records
    async index(order = ['id', 'desc'], limit=Config.get('constants.limit'), offset=1) {
        /*
        * limit = int
        * offset = int
        * order = array
        * */
        let result = await this.model.query().orderBy(order[0], order[1]).paginate(parseInt(offset),parseInt(limit))
        this.globalResponse(true,"Record fetched successfully!", result.toJSON())
    }


    //Save a record
    async store(request, response) {
        let input = request.except instanceof Function ? request.except(['password_confirmation']) : request;
        return await this.model.create(input)
    }


    //Show single record
    async show(params, response) {
        const modelObj = await this.model.find(params.id)
        return modelObj
    }


    //Update a record
    async update(params, request, response) {
        const input = request.all()
        const modelObj = await this.model.find(params.id)

        //check if the row related to this id exists
        if (!modelObj) {
            return response.status(404).json({msg: this.noRecordFound})
        }

        /*
        *check if the input is not empty -> No need to check here, validator on route will take care of it
        */

        //assigning input data in db fields
        _.forEach(input, function (e, i) {
            modelObj[i] = e
        })

        await modelObj.save()

        return modelObj
    }


    async destroy(params, response) {
        const modelObj = await this.model.find(params.id)
        if (!modelObj) {
            return response.status(404).json({data: this.noRecordFound})
        }
        await modelObj.delete()
        return response.status(200).json({msg: this.model.name + " deleted", data: modelObj})
    }

    async updateColumns(data, where){
        return await this.model.query().where(where).update(data)
    }

    async findBy(where){
        return await this.model.query().where(where).first()
    }

    async findByMany(where){
        return await this.model.query().where(where).get()
    }

    globalResponse(status, message, data) {
        return {
            status: status,
            message: message || "",
            data: data || {}
        }
    }
}

module.exports = _SqlOperations
