'use strict'

class UpdateUser {

    get sanitizationRules() {
        return {
            email: 'trim|normalize_email',
            password: 'trim'
        }
    }

    get rules() {
        return {
            username: 'required',
            password: 'min:8|confirmed'
        }
    }

    get messages() {
        return {
            'email.required': 'You must provide a email address.',
            'email.email': 'You must provide a valid email address.',
            'email.unique': 'This email is already registered.',
            'password.required': 'You must provide a password',
            'username.required': 'User Name field is required',
            'password.min': 'Password should be atleast 8 character long.',
            'password.confirmed': 'Password is not matched.'
        }
    }

    get validateAll() {
        return false
    }

    async fails(errorMessages) {
        await this.ctx.session.flash({error: errorMessages[0].message})
        return this.ctx.response.redirect('back')
    }


}

module.exports = UpdateUser
