'user-strict'


/*
 * All commonly used functions are placed here, mostly CRUD calls
 */


class BaseController{

  constructor(repo){
    this.repo = repo
  }

  async index(ctx){
    return this.repo.index(ctx)
  }

  async store({request,response}){
    return this.repo.store(request,response)
  }

  async show({params,response}){
    return this.repo.show(params,response)
  }

  async update({params,request,response}){
    return this.repo.update(params,request,response)
  }

  async destroy({params,response}){
    return this.repo.destroy(params,response)
  }

  globalResponse(status, message, data) {
    return {
      status: status,
      message: message || "",
      data: data || {}
    }
  }

  async updateColumns(data, where){
    return this.repo.updateColumns(data,where)
  }

  async findBy(where){
    return this.repo.findBy(where)
  }

  async findByMany(where){
    return this.repo.findByMany(where)
  }

}

module.exports = BaseController
