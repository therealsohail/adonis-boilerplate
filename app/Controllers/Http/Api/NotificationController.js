'use strict'

const NotificationRepo = use('App/Repositories/NotificationRepository')
const BaseController = use('BaseController')
class NotificationController extends BaseController {
  
  constructor(){
    super(NotificationRepo)
  }
  
}
module.exports = NotificationController