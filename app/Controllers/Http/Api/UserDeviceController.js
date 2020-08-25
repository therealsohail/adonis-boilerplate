'use strict'

const UserDeviceRepo = use('App/Repositories/UserDeviceRepository')
const BaseController = use('BaseController')
class UserDeviceController extends BaseController {
  
  constructor(){
    super(UserDeviceRepo)
  }
  
}
module.exports = UserDeviceController