'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class SocialLogin extends BaseValidator {
    rules = {
        username: 'required',
        email: 'required|email',
        social_platform: 'required',
        client_id: 'required',
        token: 'required',
        device_type: 'required|in:ios,android,web',
        device_token: 'required'
    }
}

module.exports = SocialLogin
