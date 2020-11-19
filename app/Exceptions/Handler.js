'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const myHelpers = use('myHelpers')
const Logger = use('Logger')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
    /**
     * Handle exception thrown during the HTTP lifecycle
     *
     * @method handle
     *
     * @param  {Object} error
     * @param  {Object} options.request
     * @param  {Object} options.response
     *
     * @return {void}
     */

    async handle(error, {request, response, view}) {
        /*DRY statements*/
        let errorBody = {src: error.status, message: error.stack}

        /*Common message*/
        let unauthorizedCodeMessage = "You must be authorized to complete this request!"

        /*******************************
         * Error Based on Text Code
         *******************************/
        let responseError
        switch (error.code) {

            case 'E_INVALID_JWT_TOKEN':
                responseError = unauthorizedCodeMessage
                break
            case 'ER_DUP_ENTRY':
                responseError = error.sqlMessage
                break
            case "E_PASSWORD_MISMATCH":
                responseError = "Incorrect Password"
                break

            case "E_USER_NOT_FOUND":
                responseError = "Record does not exist"
                break
            case "E_CANNOT_LOGIN":
                myHelpers.httpAjaxResponse(request, response, "Already Logged in", '/login')
                break
            case "E_INVALID_JWT_REFRESH_TOKEN":
                responseError = "Invalid refresh token"
                break

        }

        if (responseError) {
            return response.status(error.status).json({status:false, message: responseError, data:{}})
        }

        /*******************************
         *Error Based on Code Number
         *******************************/

        //WEB BASED
        // switch (error.status) {
        //     case 401:
        //         response.redirect('/login', false, 301)
        //         break
        //     case 404:
        //         response.redirect('/404', false, 301)
        //         break
        //     case 403:
        //         response.redirect('/', false, 301)
        //         break;
        //     default:
        //         Logger.info(myHelpers.logMsg(errorBody))
        //         return response.status(error.status).json({status:false, message: responseError, data:{}})
        //
        // }
        //     return true

        //API BASED
        let errorMessage = error.message
        switch (error.status) {
            case 401:
                errorMessage = unauthorizedCodeMessage
                break
            case 404:
                errorMessage = "The requested URL is not found on this server"
                break
        }

        Logger.info(myHelpers.logMsg(errorBody))
        return response.status(error.status).json({status:false, message: errorMessage, data:{}})

    }

    /**
     * Report exception for logging or debugging.
     *
     * @method report
     *
     * @param  {Object} error
     * @param  {Object} options.request
     *
     * @return {void}
     */
    async report(error, {request}) {
    }
}

module.exports = ExceptionHandler
