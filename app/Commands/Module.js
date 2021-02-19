'use strict'

const {Command} = require('@adonisjs/ace')
const _case = require('case')
const pluralize = require('pluralize')
const fs = require('fs')
const fse = require('fs-extra')
const Env = use('Env')


class Module extends Command {
    static get signature() {
        return `
      module
      {name: Name of the module}
      {model: Name of the model(Singular & capitalized version of your db table)}
      {--rollback: Delete module files}
      `
    }

    static get description() {
        return 'This command will create Controller, Repository, Model, Validator, Route. To create ready-made CRUD operation of this newly created module'
    }

    async handle(args, options) {

        let kebab = _case.kebab(args.name)
        let pluralKebab = pluralize.plural(kebab)
        let lowercase =  _case.lower(args.name)


        let admin = new (use('App/Commands/AdminFiles'))(args,options)
        let apiController = new (use('App/Commands/ApiController'))(args,options)
        let apiRepository = new (use('App/Commands/ApiRepository'))(args,options)
        /****************************
         *VALIDATION
         ****************************/
        if (_case.of(args.name) !== 'capital' && _case.of(args.name) !== 'pascal') {
            this.error('ERROR: The case of module name should be Capital or PascalCase')
            return false;
        }

        if (_case.of(args.model) !== 'capital' && _case.of(args.model) !== 'pascal') {
            this.error('ERROR: The case of model(param 2) name should be Capital or PascalCase')
            return false;
        }

        /****************************
         *DELETE
         ****************************/
        if (options.rollback) {
            this.warn('########## FILES ##########')
            let files_to_be_deleted = [
                'app/Repositories/' + args.name + 'Repository.js',
                'app/Controllers/Http/Api/' + args.name + 'Controller.js',
                'app/Models/Sql/' + args.model + '.js',
                'app/Models/NoSql/' + args.model + '.js',
                'app/Validators/' + args.name + '.js',
                'resources/views/admin/' + _case.kebab(args.name),
                'app/Controllers/Http/admin/' + args.name + 'Controller.js',
            ]

            files_to_be_deleted.forEach((v, i) => {
                this.warn(i + 1 + '. ' + v)
            })

            let ask_delete = await this.ask(this.chalk.red("All above files will be deleted. Are you sure? (y/n)"))

            if (ask_delete !== 'y') {
                this.error("Operation Aborted")
                return false
            }

            await Promise.all(files_to_be_deleted.map(async (file) => {
                let dest_name = 'app/RecycleBin/' + file;
                //check src path
                if (this.pathExists(file)) {
                    //check dest path
                    if (this.pathExists('app/RecycleBin/' + file)) {
                        dest_name = 'app/RecycleBin/' + file + '_' + Math.floor(new Date() / 1000)
                    }
                    try {
                        await fse.moveSync(file, dest_name)
                        this.info("Deleted: " + file)
                    } catch (e) {
                        console.log(e.message)
                    }


                }
            })).then(() => this.warn(this.chalk.blue("ALL DONE, Make sure to manually delete the route path of this module.")));

            return true //to stop further execution of script.
        }


        /****************************
         *CREATE
         ****************************/
        let singular_model_name = pluralize.singular(args.model)
        //SQL MODEL CODE

        let model_sql_content = `'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class ${singular_model_name} extends Model {
    static get table() {
        return '${pluralize.plural(_case.snake(args.model))}'
    }

    static get primaryKey() {
        return 'id'
    }

    // getCreatedAtAgo({created_at}) {
    //     let formattedDate = moment(created_at).format(Config.get('constants.db_date_format'))
    //     return moment(formattedDate, Config.get('constants.db_date_format')).fromNow()
    // }
}

module.exports = ${args.model}`


        //NOSQL MODEL CODE

        let model_nosql_content = "'use strict'\n" +
            "\n" +
            "const BaseModel = use('MongooseModel')\n" +
            "\n" +
            "/**\n" +
            " * @class " + singular_model_name + "\n" +
            " */\n" +
            "class " + singular_model_name + " extends BaseModel {\n" +
            "  static boot ({ schema }) {\n" +
            "    // Hooks:\n" +
            "    // this.addHook('preSave', () => {})\n" +
            "    // this.addHook('preSave', '" + singular_model_name + "Hook.method')\n" +
            "    // Indexes:\n" +
            "    // this.index({}, {background: true})\n" +
            "  }\n" +
            "  /**\n" +
            "   * " + singular_model_name + "'s schema\n" +
            "   */\n" +
            "  static get schema () {\n" +
            "    return {\n" +
            "\n" +
            "    }\n" +
            "  }\n" +
            "\n" +
            "  //Link Model and collection, in case where model name mismatch collection name\n" +
            "  static get schemaOptions() {\n" +
            "    return { collection: '" + pluralize.plural(args.model) + "', };\n" +
            "  }\n" +
            "}\n" +
            "\n" +
            "module.exports = " + singular_model_name + ".buildModel('" + singular_model_name + "')\n"


        //REPOSITORY CODE


        let repository_content = apiRepository.apiRepoContent()

        let controller_content = apiController.apiControllerContent()

        let validator_content = `'use strict'
const BaseValidator = use('App/Validators/BaseValidator')

class ${args.name} extends BaseValidator {
    constructor() {
        super()
    }

    rules = {
        name: 'required',
        file: 'required'
    }
}

module.exports = ${args.name}
`


        //WRITING API CONTROLLER FILES
        const controller_exists = await this.pathExists('app/Controllers/Http/Api/' + args.name + 'Controller.js')
        if (controller_exists) {
            this.warn(args.name + "Controller already exists")
        } else {
            await this.writeFile('app/Controllers/Http/Api/' + args.name + 'Controller.js', controller_content)
            this.info(args.name + "Controller is created")
        }

        //WRITING REPO FILES
        const repo_exists = await this.pathExists('app/Repositories/' + args.name + 'Repository.js')
        if (repo_exists) {
            this.warn(args.name + "Repository already exists")
        } else {
            await this.writeFile('app/Repositories/' + args.name + 'Repository.js', repository_content)
            this.info(args.name + "Repository is created")
        }

        //WRITING SQL MODEL FILES
        const model_sql_exists = await this.pathExists('app/Models/Sql/' + args.model + '.js')
        if (model_sql_exists) {
            this.warn(args.model + " (Model) already exists")
        } else {
            await this.writeFile('app/Models/Sql/' + args.model + '.js', model_sql_content)
            this.info(args.model + " (SQL Model) is created")
        }

        //WRITING NOSQL MODEL FILES
        const model_nosql_exists = await this.pathExists('app/Models/NoSql/' + args.model + '.js')
        if (model_nosql_exists) {
            this.warn(args.model + " (Model) already exists")
        } else {
            await this.writeFile('app/Models/NoSql/' + args.model + '.js', model_nosql_content)
            this.info(args.model + " (NOSQL Model) is created")
        }

        //WRITING ROUTES FILE
        try {
            let route_content = `/*API-${args.name}*/
Route.resource('${pluralKebab}','Api/${args.name}Controller')

/*ADMIN-${args.name}*/
Route.get('${pluralKebab}', 'admin/${args.name}Controller.index')
Route.post('${kebab}', 'admin/${args.name}Controller.store')
Route.get('${kebab}', 'admin/${args.name}Controller.create')
Route.get('${kebab}/:id', 'admin/${args.name}Controller.show')
Route.get('delete-${kebab}/:id', 'admin/${args.name}Controller.destroy')
Route.get('edit-${kebab}/:id', 'admin/${args.name}Controller.edit')
Route.put('${kebab}/:id', 'admin/${args.name}Controller.update')
            
            `
            fs.appendFileSync('start/routes.js', route_content);
            this.info('Route added')
        } catch (err) {
            this.error(err)
            this.error("Unable to add routes in start/routes.js")
        }

        //WRITING VALIDATOR FILES
        let ask_validator = await this.ask('Do you want to add Validator? (y/n)')
        ask_validator = ask_validator.toLowerCase()
        if (ask_validator === 'y') {
            const validator_exists = await this.pathExists('app/Validators/' + args.name + '.js')
            if (validator_exists) {
                this.warn(args.name + " (Validator) already exists")
            } else {
                await this.writeFile('app/Validators/' + args.name + '.js', validator_content)
                this.info(args.model + " (Validator) is created")
            }
        }


        /***************ADMIN PANEL****************/

        let askAdmin = await this.ask('Do you need admin module? (y/n)')
        askAdmin = askAdmin.toLowerCase()
        if (askAdmin === 'y') {

            let module = args.name
            let lowercase =  _case.lower(module) //firstmodule
            let pascal = _case.pascal(module)
            let kebab = _case.kebab(module)
            let camel = _case.camel(module)
            let pluralKebab = pluralize.plural(kebab)


            /*ADMIN CONTROLLER*/
            const adminControllerExists = await this.pathExists(`app/Controllers/Http/admin/${args.name}Controller.js`)
            if (adminControllerExists) {
                this.warn(args.name + " (Admin Controller) already exists")
            } else {
                await this.writeFile(`app/Controllers/Http/admin/${args.name}Controller.js`, admin.controllerContent())
                this.info(args.model + " (Admin Controller) is created")
            }

            /*ADMIN RESOURCES*/
            const resourceIndex = await this.pathExists(`resources/views/admin/${kebab}/index.edge`)
            if (resourceIndex) {
                this.warn(args.name + " (index.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/index.edge`, await admin.resourceIndex())
                this.info(args.model + " (index.edge) is created")
            }

            const resourceCreate = await this.pathExists(`resources/views/admin/${kebab}/create.edge`)
            if (resourceCreate) {
                this.warn(args.name + " (create.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/create.edge`, admin.resourceCreate())
                this.info(args.model + " (create.edge) is created")
            }

            const resourceShow = await this.pathExists(`resources/views/admin/${kebab}/show.edge`)
            if (resourceShow) {
                this.warn(args.name + " (show.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/show.edge`, admin.resourceShow())
                this.info(args.model + " (show.edge) is created")
            }

            const resourceEdit = await this.pathExists(`resources/views/admin/${kebab}/edit.edge`)
            if (resourceEdit) {
                this.warn(args.name + " (edit.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/edit.edge`, admin.resourceEdit())
                this.info(args.model + " (edit.edge) is created")
            }

            const resourceCreateFields = await this.pathExists(`resources/views/admin/${kebab}/create-fields.edge`)
            if (resourceCreateFields) {
                this.warn(args.name + " (create-fields.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/create-fields.edge`, admin.resourceCreateFields())
                this.info(args.model + " (create-fields.edge) is created")
            }

            const resourceShowFields= await this.pathExists(`resources/views/admin/${kebab}/show-fields.edge`)
            if (resourceShowFields) {
                this.warn(args.name + " (show-fields.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/show-fields.edge`, admin.resourceShowFields())
                this.info(args.model + " (show-fields.edge) is created")
            }

            const resourceDatatableActions= await this.pathExists(`resources/views/admin/${kebab}/datatable-actions.edge`)
            if (resourceDatatableActions) {
                this.warn(args.name + " (datatable-actions.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/datatable-actions.edge`, await admin.resourceDatatableActions())
                this.info(args.model + " (datatable-actions.edge) is created")
            }

            const resourceFields= await this.pathExists(`resources/views/admin/${kebab}/fields.edge`)
            if (resourceFields) {
                this.warn(args.name + " (fields.edge) already exists")
            } else {
                await this.writeFile(`resources/views/admin/${kebab}/fields.edge`, admin.resourceFields())
                this.info(args.model + " (fields.edge) is created")
            }
        }

        /*ADD SIDEBAR MENU ITEM*/
        try {
            let sidebarContent = `

<!--${args.name}-->
<li class="nav-item has-treeview menu-open">
    <a href="{{baseUrl('admin/${pluralKebab}')}}"
       class="nav-link {{ request.match(['/admin/${pluralKebab}','/admin/edit-${kebab}/:id','/admin/${kebab}/:id','/admin/${kebab}']) ? 'active': '' }}">
        <i class="nav-icon fas fa-bullhorn"></i>
        <p>
            ${_case.sentence(lowercase)}
        </p>
    </a>
</li>`
            fs.appendFileSync('resources/views/admin/layouts/sidebar-listing.edge', sidebarContent);
            this.info('Sidebar menu added')
        } catch (err) {
            this.error(err)
            this.error("Unable to add sidebar menu in views/admin/layouts/sidebar-listing.edge")
        }


        //ALL DONE
        this.success(args.name + " module has been generated. Make sure to adjust the followings:")
        console.log(this.chalk.blue('\t=> Move route to route group (if any)\n\t=> Check DB Table related to this model exists\n\t=> Add rules in Validator and link to route (if required)'))
    }
}

module.exports = Module
