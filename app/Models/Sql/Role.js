'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class Role extends Model {
    static ADMIN = 1;
    static USER = 2;
    static BUSINESS_OWNER = 3;

    static get table() {
        return 'roles'
    }

    static get primaryKey() {
        return 'id'
    }

    // getCreatedAtAgo({created_at}) {
    //     let formattedDate = moment(created_at).format(Config.get('constants.db_date_format'))
    //     return moment(formattedDate, Config.get('constants.db_date_format')).fromNow()
    // }
}

module.exports = Role