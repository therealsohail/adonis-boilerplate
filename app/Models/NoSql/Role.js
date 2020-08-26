'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Role
 */
class Role extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'RoleHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Role's schema
   */
  static get schema () {
    return {

    }
  }

  //Link Model and collection, in case where model name mismatch collection name
  static get schemaOptions() {
    return { collection: 'Roles', };
  }
}

module.exports = Role.buildModel('Role')
