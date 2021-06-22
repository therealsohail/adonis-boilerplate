'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Blog
 */
class Blog extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'BlogHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Blog's schema
   */
  static get schema () {
    return {

    }
  }

  //Link Model and collection, in case where model name mismatch collection name
  static get schemaOptions() {
    return { collection: 'Blogs', };
  }
}

module.exports = Blog.buildModel('Blog')
