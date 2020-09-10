'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Notification
 */
class Notification extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'NotificationHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Notification's schema
   */
  static get schema () {
    return {

    }
  }

  //Link Model and collection, in case where model name mismatch collection name
  static get schemaOptions() {
    return { collection: 'Notifications', };
  }
}

module.exports = Notification.buildModel('Notification')
