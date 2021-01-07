'use strict'
const Drive = use('Drive')
const fs = require('fs')
const Helpers = use('Helpers')
const path = require('path')

/*
* **********************************
* NOTE: make sure to put route name in manual_processing array in config/bodyParser.js
* **********************************
* */

class s3Repository {

    static async s3Upload(request, fileName, s3Path, size = "5mb", types = ['png', 'jpg', 'jpeg']) {

        /*
        * s3Path = uploads/card_image
        * */

        /*Upload image to s3*/
        let validationError = false
        try{
            const validationOptions = {
                types,
                size
            }

            let uploadedFile = null

            request.multipart.file(fileName, validationOptions, async (file) => {
                // set file size from stream byteCount, so adonis can validate file size


                file.size = file.stream.byteCount

                // run validation rules
                await file.runValidations()

                // catches validation errors, if any and then throw exception
                const error = file.error()
                // if (error.message) {
                //     throw new Error(error.message)
                // }

                if(error.message){
                    validationError = error.message
                }

                if (!error.message) {
                    // upload file to s3
                    uploadedFile = await Drive.disk('s3').put(`${s3Path}/${file.clientName}`, file.stream, {
                        ContentType: file.headers['content-type'],
                        ACL: 'public-read'
                    })
                }

            })

            /*saving field data*/
            let body = {};
            await request.multipart.field((name, value) => {
                body[name] = value;
            });

            // You must call this to start processing uploaded file
            await request.multipart.process()

            if(validationError)
                throw new Error(validationError)

            return {
                status: true,
                data: {
                    s3ImageUrl:uploadedFile,
                    formData: body
                }
            }
        }catch (e) {
            return {
                status: false,
                message: e.message
            }
        }

    }


}


module.exports = s3Repository