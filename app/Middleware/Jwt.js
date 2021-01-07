'use strict'
const NotFoundException = use('App/Exceptions/NotFoundException')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Token = use("App/Models/Sql/Token")

class Jwt {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({request, response, auth}, next) {
        auth = await auth.authenticator('jwt')
        await auth.check()
        let isLoggedIn = await Token.query().where({user_id: auth.user.id, is_revoked: 0}).orderBy('id','desc').first()
        if (isLoggedIn) {
            await next()
        } else {
            return response.json({status: false, message: "You must be authorized to complete this request!", data: {}})
        }
    }

    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async wsHandle({request}, next) {
        // call next to advance the request
        await next()
    }
}

module.exports = Jwt
