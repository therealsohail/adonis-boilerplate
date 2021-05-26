'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
    modelPath: Env.get('DB_CONNECTION') === 'mysql' ? 'App/Models/Sql/' : 'App/Models/NoSql/',
    date_format: 'MM-DD-YYYY HH:mm:ss',
    db_date_format: 'YYYY-DD-MM HH:mm:ss',
    notFoundUser: '/frontend/images/user.jpg',
    fcm_key: 'AAAAeGyD_X8:APA91bFwYsKRqOAcX54ytuaSdAd95nagu_D4rp3p3-fq5CnTzrD8pVYt_eDxa6W5adgfDCs8jEOmWhJFscLkKF1GTlqqL7lO_cIcrpRiztGiNymhxfZ6nQRPNc6qEPrcUgGUNUtfVcCB',
    projectName: "Boiler Plate",
    website: "https://etherlegends.io",
    s3Path: 'uploads/card_image',
    limit: 10,
    adminLimit: 1000,
    imageResize: {
        medium: 500,
        small: 100
    },
    uploadChannel: 'local'
}
