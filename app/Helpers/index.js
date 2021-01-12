'use strict'
const Env = use('Env')
const Config = use('Config')
const Logger = use('Logger')
const ImageResizer = use('node-image-resizer')
const FCM = use('fcm-node');
const Ws = use('Ws')
const fs = require('fs');
const AWS = require('aws-sdk');
const sharp = require('sharp');

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
    },
    async sendWebSocketNotification(title, body) {

        let topic = Ws.getChannel('notification:*').topic('notification:subscribedUser')
        if (topic) {
            /*notification data*/
            let notificationData = {
                // title: _.truncate(title, {length: 40}),
                title,
                body: _.truncate(body, {length: 85})
            }

            /*send notification to users*/
            topic.broadcast('newNotification', notificationData)
        }
    },

    async sendNotificationToUser(title, body, userId) {

        /*Saving data*/
        // await Notification.create({
        //     to_user: userId,
        //     title: title,
        //     body: body
        // })

        /*Live Broadcasting */
        let topic = Ws.getChannel('notification:*').topic('notification:user' + userId)
        if (topic) {
            /*notification data*/
            let notificationData = {
                title,
                body
            }

            /*send notification to users*/
            topic.broadcast('newNotification', notificationData)


        }
    },
    async uploadFileS3(fileName, random_name, path) {
        /* INSTRUCTIONS */
        // - use env(S3_URL) for full url
        // for medium variation
        // let medium_image = image.split("/")
        // let path = medium_image[0] + '/medium_' + medium_image[1]
        /* END INSTRUCTIONS */
        const s3 = await new AWS.S3({
            accessKeyId: Env.get('S3_KEY'),
            secretAccessKey: Env.get('S3_SECRET')
        });
        // Read content from the file
        const fileContent = fs.readFileSync(fileName);

        // Setting up S3 upload parameters
        const params = {
            Bucket: Env.get('S3_BUCKET'),
            ACL: 'public-read'
        };
        await sharp(fileName).resize(400).toBuffer()
            .then(async buffer => {
                params.Body = buffer;
                params.Key = path + "medium_" + random_name;
                s3.upload(params, (err, data) => {
                    if (err) {
                        console.log("err:", err)
                    }
                });
            }).catch(function (err) {
                console.log("Got Error");
            });
        await sharp(fileName).resize(80).toBuffer()
            .then(async buffer => {
                params.Body = buffer;
                params.Key = path + "small_" + random_name;
                s3.upload(params, (err, data) => {
                    if (err) {
                        console.log("err:", err)
                    }
                });
            }).catch(function (err) {
                console.log("Got Error");
            });
        let response = await new Promise((resolve, reject) => {
            params.Key = path + random_name;
            params.Body = fileContent;
            s3.upload(params, (err, data) => {
                if (err) {
                    return reject({
                        error: true,
                        message: err,
                    })
                }
                return resolve({
                    success: true,
                    data: path + random_name
                })
            });
        })

        return response.data;
    },

    async deleteS3Object(path) {
        const s3 = await new AWS.S3({
            accessKeyId: Env.get('S3_KEY'),
            secretAccessKey: Env.get('S3_SECRET')
        });
        var params = {
            Bucket: Env.get('S3_BUCKET'),
            Key: path
        };
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log("error:", err)
            }
        });
        // delete mediuim
        let medium_image = path.split("/")
        let medium_path = medium_image[0] + '/medium_' + medium_image[1]
        params.Key = medium_path;
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log("error:", err)
            }
        });
        // delete small
        let small_image = path.split("/")
        let small_path = small_image[0] + '/small_' + small_image[1]
        params.Key = small_path;
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log("error:", err)
            }
        });
    }
}
