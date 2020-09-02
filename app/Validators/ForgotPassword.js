'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class ForgotPassword extends BaseValidator {
    rules = {
        email: 'required|email',
    }
}

module.exports = ForgotPassword
