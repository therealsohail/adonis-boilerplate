'use strict'
const BaseValidator = use('App/Validators/BaseValidator')

class Login extends BaseValidator {
    constructor() {
        super()
    }

    rules = {
        email: 'required|email',
        password: 'required',
        device_type: "required",
        device_token: "required",
    }
}

