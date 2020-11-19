'use strict'
const NotFoundException = use('App/Exceptions/NotFoundException')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class JWT {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({request, response, auth}, next) {
        await auth.authenticator('jwt').check()
        await next()
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

module.exports = JWT
