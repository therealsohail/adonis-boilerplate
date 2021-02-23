'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', async ({response}) => {
    response.redirect('admin/login')
})


/*******************************
 *ADMIN ROUTES
 *******************************/

Route.get('logout', async ({auth, response}) => {
    await auth.logout()
    response.redirect('admin/login')
})
Route.get('admin/login', ({auth, response, view}) => {
    if (auth.user) {
        return response.route('admin.dashboard')
    }
    return view.render('admin.login')
})
Route.post('admin/login', 'admin/UserController.login').validator('AdminLogin')
Route.group(() => {
    Route.get('dashboard', 'admin/UserController.dashboard').as('admin.dashboard')
    Route.get('users', 'admin/UserController.index')
    Route.get('user/:id', 'admin/UserController.show')
    Route.get('delete-user/:id', 'admin/UserController.destroy')
    Route.get('edit-user/:id', 'admin/UserController.edit')
    Route.put('user/:id', 'admin/UserController.update')
    Route.get('add-user', 'admin/UserController.create')
    Route.post('user', 'admin/UserController.store').validator('AddUser')


}).prefix('admin/').middleware(['authenticated'])


Route.get('404', ({view}) => {
    return view.render('404')
})


/*******************************
 *API ROUTES
 *******************************/

/*Non JWT Requests*/
Route.group(() => {
    Route.resource('users', 'Api/UserController')
        .validator(new Map([
            [['users.store'], ['SaveUser']],
            [['users.update'], ['UpdateUser']],
            //[['users.delete'], ['DeleteUser']]
        ]))
    Route.delete('delete-all-users', 'Api/UserController.deleteAllUsers')
    Route.post('register', 'Api/UserController.register').validator('RegisterUser')
    Route.post('login', 'Api/UserController.login').validator('Login')
    Route.post('refresh-token', 'Api/UserController.refreshToken').validator('RefreshToken')
    Route.post('social-login', 'Api/UserController.socialLogin').validator('SocialLogin')
    Route.post('forgot-password', 'Api/UserController.forgotPassword').validator('ForgotPassword')
    Route.post('verify-otp', 'Api/UserController.verifyOTP').validator('VerifyOTP')
    Route.post('reset-password', 'Api/UserController.resetPassword').validator('ResetPassword')

}).prefix('api/v1/')

/*JWT Requests*/
Route.group(() => {
    Route.get('all-users', 'Api/UserController.allUsers')
    Route.resource('userdevice', 'Api/UserDeviceController')
    Route.post('change-password', 'Api/UserController.changePassword').validator('ChangePassword')

    //Logout Api
    Route.get('logout', async ({auth, response}) => {
        auth = await auth.authenticator('jwt')
        const apiToken = auth.getAuthHeader()
        await auth.revokeTokens([apiToken],true)
        response.json({status: true, message:"Logged out successfully", data: {}})
    })
}).prefix('api/v1/').middleware(['jwt'])




            