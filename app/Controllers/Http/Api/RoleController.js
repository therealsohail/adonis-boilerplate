'use strict'

const RoleRepo = use('App/Repositories/RoleRepository')
const BaseController = use('BaseController')
class RoleController extends BaseController {
  
  constructor(){
    super(RoleRepo)
  }
  
}
module.exports = RoleController