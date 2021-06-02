'use strict'
const AdminBaseValidator = use('App/Validators/AdminBaseValidator');

class AddPage extends AdminBaseValidator {
    constructor() {
        super()
    }

    rules = {
        title: 'required',
        content: 'required'
    }
    messages = {
        'title.required': 'You must provide a title.',
        'content.required': 'You must provide content.'
    }
}

module.exports = AddPage
