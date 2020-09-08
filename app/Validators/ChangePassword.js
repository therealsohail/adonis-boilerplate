'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class ChangePassword extends BaseValidator {
    rules = {
        current_password: 'required',
        password: 'required|min:6|confirmed'
    }
}

module.exports = ChangePassword
