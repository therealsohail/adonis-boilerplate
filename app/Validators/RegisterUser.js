'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class RegisterUser extends BaseValidator {
    rules = {
        username: 'required',
        email: 'required|email|unique:users',
        password: 'required',
        device_type: 'required|in:ios,android,web',
        device_token: 'required'
    }
}

module.exports = RegisterUser
