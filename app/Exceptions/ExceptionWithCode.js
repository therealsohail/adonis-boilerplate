'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')


class ExceptionWithCode extends LogicalException {

    /**
     * Handle this exception by itself
     */
    // handle () {}
    constructor(message, statusCode = 400) {
        super(message, statusCode)
    }

}

module.exports = ExceptionWithCode
