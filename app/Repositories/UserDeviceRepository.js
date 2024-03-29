'use strict'
const {ioc} = require('@adonisjs/fold')
const BaseRepository = use('App/Repositories/_BaseRepository')
const Config = use('Config')

class UserDeviceRepository extends BaseRepository {
    model

    constructor(model) {
        super(model)
        this.model = model
    }

    async store(request, response) {
        const input = request.only(['user_id', 'device_type', 'device_token', 'push_notification'])
        return await this.model.findOrCreate(
            {user_id: input.user_id, 'device_type': input.device_type, device_token: input.device_token},
            input
        )
    }

}

ioc.singleton('UserDeviceRepository', function (app) {
    const model = app.use(Config.get('constants.modelPath') + 'UserDevice')
    return new UserDeviceRepository(model)
})

module.exports = ioc.use('UserDeviceRepository')