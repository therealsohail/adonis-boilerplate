'use strict'

const TestRepo = use('App/Repositories/TestRepository')
const BaseController = use('BaseController')
const s3Repo = use('App/Repositories/s3Repository')
const Config = use('Config')

class TestController extends BaseController {
  
  constructor(){
    super(TestRepo)
  }

  /*Example of uploading file to s3*/
  async testS3({request,response,auth}){
    let s3Result = await s3Repo.s3Upload(request, 's3_card_image_url', Config.get('constants.s3Path'), '1mb', ['png','jpg','jpeg'])

    /*Check the status of s3Upload and fetch formData*/
    if(!s3Result.status){
      throw new Error(s3Result.message)
    }
    let formData = s3Result.data.formData
    console.log(s3Result)

    /*Custom Validation of form data*/
    let requiredParams = ['email', 'name']
    let formDataKeys = Object.keys(s3Result.data.formData)
    for (let requiredParam of requiredParams){
      if (!formDataKeys.includes(requiredParam)){
        throw new Error(`${requiredParam} is required`)
      }
    }



  }
}
module.exports = TestController