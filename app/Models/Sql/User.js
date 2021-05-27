'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')
const fs = use('fs')
const myHelpers = use('myHelpers')
const Env = use('Env')

class User extends Model {
    static get computed() {
        return ['image_url', 'medium_image_url', 'small_image_url', 'role_csv']
    }

    static fillable = ['username', 'about', 'phone', 'email', 'password', 'image', 'address', 'is_verified', 'is_approved'];

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
        this.addHook('afterFind', 'UserHook.rolesCsv')
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

    roles() {
        return this.belongsToMany('App/Models/Sql/Role')
    }

    devices() {
        return this.hasMany('App/Models/Sql/UserDevice')
    }


    getImageUrl({path}) {
        if (path != null && !path.startsWith("http")) {
            return myHelpers.imageWithBaseURLOrNotFound(path)
        }
        return path;
    }

    getMediumImageUrl({path}) {
        if (path != null && !path.startsWith("http")) {
            return myHelpers.getImageVersion(path, 'medium')
        }
        return path;
    }

    getSmallImageUrl({path}) {
        if (path != null && !path.startsWith("http")) {
            return myHelpers.getImageVersion(path, 'small')
        }
        return path;
    }

}

module.exports = User