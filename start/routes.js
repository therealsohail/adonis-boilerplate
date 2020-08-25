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

Route.on('/').render('welcome')

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
    Route.post('refreshToken', 'Api/UserController.refreshToken').validator('RefreshToken')
    Route.post('imageUpload', 'Api/UserController.testNotification')
}).prefix('api/v1/')

Route.group(() => {
    Route.resource('userdevice', 'Api/UserDeviceController')
}).prefix('api/v1/').middleware(['auth'])


Route.get('logout', async ({auth, response}) => {
    await auth.logout()
    response.redirect('login')
})

Route.resource('userdetail', 'Api/UserDetailController')
