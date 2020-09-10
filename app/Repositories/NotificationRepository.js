'use strict'
const { ioc } = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class NotificationRepository extends BaseRepository{
  model
  constructor(model){
    super(model)
    this.model = model
  }

}

ioc.singleton('NotificationRepository', function (app) {
  const model = app.use(Config.get('constants.modelPath')+'Notification')
  return new NotificationRepository(model)
})

module.exports = ioc.use('NotificationRepository')