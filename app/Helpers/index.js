'use strict'
const Env = use('Env')
const Config = use('Config')
const Logger = use('Logger')
const ImageResizer = use('node-image-resizer')
const FCM = use('fcm-node');

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
        let uploadPath = 'public/' + dir;
        await file.move('public', {
            name: dir + random_name,
            overwrite: true
        })

        if (!file.moved()) {
            return response.status(500).json({message: file.error().message})
        }
        await this.resizeImage(uploadPath, random_name, uploadPath)
        return file.fileName;
    },
    async sendNotification(title = null, body = null, data = {}, tokens) {
        var serverKey = Config.get('constants.fcm_key');
        var fcm = await new FCM(serverKey);

        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            registration_ids: tokens,
            // collapse_key: 'green',

            notification: {
                title: title,
                body: body
            },

            data: data
        };

        fcm.send(message, function (err, response) {
                if (err) {
                    // console.log('error')
                } else {
                    // console.log('success', response)
                }
            }
        );
    }
}
