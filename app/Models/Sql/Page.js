'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class Page extends Model {
    static fillable = [
        'slug',
        'title',
        'content'
    ];

    static get table() {
        return 'pages'
    }

    static get primaryKey() {
        return 'id'
    }
}

module.exports = Page