'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class UserDevice
 */
class UserDevice extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'UserDeviceHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * UserDevice's schema
   */
  static get schema () {
    return {

    }
  }

  //Link Model and collection, in case where model name mismatch collection name
  static get schemaOptions() {
    return { collection: 'UserDevices', };
  }
}

module.exports = UserDevice.buildModel('UserDevice')
