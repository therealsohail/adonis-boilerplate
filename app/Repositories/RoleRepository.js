'use strict'
const { ioc } = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class RoleRepository extends BaseRepository{
  model
  constructor(model){
    super(model)
    this.model = model
  }

}

ioc.singleton('RoleRepository', function (app) {
  const model = app.use(Config.get('constants.modelPath')+'Role')
  return new RoleRepository(model)
})

module.exports = ioc.use('RoleRepository')