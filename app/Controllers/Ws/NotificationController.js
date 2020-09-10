'use strict'
const NotificationModel = use('App/Models/Sql/Notification')

class NotificationController {
    constructor({socket, request}) {
        this.socket = socket
        this.request = request
    }

    async onUnreadNotification(input) {
        let unreadNotificationCount = (await NotificationModel.query().where('notifiable_id', input.user_id).where('read_at', null).count())[0]['count(*)']
        await this.socket.emit('unreadNotification', {count: unreadNotificationCount})
    }
}

module.exports = NotificationController
