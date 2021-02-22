'use strict'

const _case = require('case')
const pluralize = require('pluralize')
const Database = use('Database')

class Model {


    constructor(args, options) {
        this.args = args
        this.options = options

        this.tableName = pluralize.plural(_case.snake(this.args.name))
    }

    async sqlModel() {

        let tableName = this.tableName

        let columns = await Database.table(tableName).columnInfo();
        let colArray = Object.entries(columns);


        let content = `'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class ${this.args.name} extends Model {
    static get table() {
        return '${pluralize.plural(_case.snake(this.args.model))}'
    }
    
    static fillable = [`

        if (colArray.length > 0) {
            for (let col of colArray) {
                let colName = _case.sentence(_case.lower(col[0]))
                content += `'${col[0]}',`
            }
        }

        content += `]
    static get primaryKey() {
        return 'id'
    }

    // getCreatedAtAgo({created_at}) {
    //     let formattedDate = moment(created_at).format(Config.get('constants.db_date_format'))
    //     return moment(formattedDate, Config.get('constants.db_date_format')).fromNow()
    // }
}

module.exports = ${this.args.model}`
        return content
    }
}

module.exports = Model