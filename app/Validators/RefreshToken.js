'use strict'

class RefreshToken {
    get rules() {
        return {
            refresh_token: 'required'
        }
    }
}

module.exports = RefreshToken
