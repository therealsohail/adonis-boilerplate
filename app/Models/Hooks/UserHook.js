'use strict'

const UserHook = exports = module.exports = {}

UserHook.rolesCsv = async (model) => {
    let roles = (await model.roles().fetch()).toJSON()
    let roles_csv = [];
    await roles.map((role, index) => {
        roles_csv.push(role.display_name)
    })
    return model.$sideLoaded.rolesCsv = roles_csv.join();
}
