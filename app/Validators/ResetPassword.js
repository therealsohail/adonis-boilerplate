'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class ResetPassword extends BaseValidator {
    rules = {
        email: 'required|email',
        verification_code: 'required',
        password: 'required|confirmed',
    }
}

module.exports = ResetPassword
