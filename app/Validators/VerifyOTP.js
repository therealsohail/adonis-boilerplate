'use strict'
const BaseValidator = use('App/Validators/BaseValidator');

class VerifyOTP extends BaseValidator {
    rules = {
        verification_code: 'required',
    }
}

module.exports = VerifyOTP
