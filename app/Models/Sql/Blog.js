'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class Blog extends Model {
  static get table() {
    return 'blogs'
  }

  static fillable = ['id', 'user_id', 'title', 'body', 'created_at', 'updated_at', 'image']

  user() {
    return this.belongsTo("App/Models/Sql/User")
  }

  static get primaryKey() {
    return 'id'
  }

  // getCreatedAtAgo({created_at}) {
  //     let formattedDate = moment(created_at).format(Config.get('constants.db_date_format'))
  //     return moment(formattedDate, Config.get('constants.db_date_format')).fromNow()
  // }
}

module.exports = Blog
