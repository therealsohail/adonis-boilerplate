'use strict'
const Env = use('Env')

const Logger = use('Logger')
const ImageResizer = use('node-image-resizer')
module.exports = {
    /*Log message*/
    logMsg(msg) {
        return {
            timestamp: new Date().getTime(),
            msg
        }
    },
    async resizeImage(sourcePath, sourceImage, destinationPath = null) {
        destinationPath = destinationPath || sourceImage
        const setup = {
            all: {
                path: destinationPath,
                quality: 100
            },
            versions: [{
                prefix: 'medium_',
                width: 512,
                height: 256
            }, {
                quality: 100,
                prefix: 'small_',
                width: 128,
                height: 64
            }]
        }
        ImageResizer(sourcePath + sourceImage, setup)
    },
    async uploadImage(file, dir) {
        let random_name = `${new Date().getTime()}.${file.extname}`
        await file.move('public', {
            name: dir + random_name,
            overwrite: true
        })

        if (!file.moved()) {
            return response.status(500).json({message: file.error().message})
        }
        return file.fileName;
    }
}
