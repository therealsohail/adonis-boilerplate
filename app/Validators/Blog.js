'use strict'
const BaseValidator = use('App/Validators/BaseValidator')

class Blog extends BaseValidator {
    constructor() {
        super()
    }

    rules = {
        name: 'required',
        file: 'required'
    }
}

module.exports = Blog
