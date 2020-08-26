'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')
const fs = use('fs')
const myHelpers = use('myHelpers')
const Env = use('Env')

class User extends Model {
    static get computed() {
        return ['image_url', 'medium_image_url', 'small_image_url']
    }

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.password) {
                userInstance.password = await Hash.make(userInstance.password)
            }
        })
    }

    static get table() {
        return 'Users'
    }

    static get primaryKey() {
        return 'id'
    }

    static get hidden() {
        return ['password']
    }

    /**
     * A relationship on tokens is required for auth to
     * work. Since features like `refreshTokens` or
     * `rememberToken` will be saved inside the
     * tokens table.
     *
     * @method tokens
     *
     * @return {Object}
     */
    tokens() {
        return this.hasMany('App/Models/Sql/Token')
    }

    devices() {
        return this.hasMany('App/Models/Sql/UserDevice')
    }

    getImageUrl({image}) {
        let path = 'public/' + image
        if (fs.existsSync(path)) {
            return Env.get('APP_URL') + '/' + image
        } else {
            return Env.get('APP_URL') + '/thumbnail.jpg'
        }
    }

    getMediumImageUrl({image}) {
        let path = 'public/' + image
        let medium_image = image.split("/")
        if (fs.existsSync(path)) {
            return Env.get('APP_URL') + '/' + medium_image[0] + '/medium_' + medium_image[1]
        } else {
            return Env.get('APP_URL') + '/thumbnail.jpg'
        }
    }

    getSmallImageUrl({image}) {
        let path = 'public/' + image
        let medium_image = image.split("/")
        if (fs.existsSync(path)) {
            return Env.get('APP_URL') + '/' + medium_image[0] + '/small_' + medium_image[1]
        } else {
            return Env.get('APP_URL') + '/thumbnail.jpg'
        }
    }

}

module.exports = User