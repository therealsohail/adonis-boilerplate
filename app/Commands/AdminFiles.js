'use strict'

const _case = require('case')
const pluralize = require('pluralize')
const fs = require('fs')
const fse = require('fs-extra')
const Database = use('Database')

class AdminFiles {


    constructor(args, options) {
        this.args = args
        this.options = options
        this.module = this.args.name
        this.lower = this.module.toLowerCase() //firstmodule
        this.lowercase = _case.lower(this.module) //firstmodule
        this.capital = _case.capital(this.module,' ') //firstmodule
        this.pascal = _case.pascal(this.module)
        this.kebab = _case.kebab(this.module)
        this.camel = _case.camel(this.module)
        this.pluralKebab = pluralize.plural(this.kebab)
        this.tableName = pluralize.plural(_case.snake(this.args.name))
    }

    controllerContent() {


        return `'use strict'
        
const ${this.module}Repo = use('App/Repositories/${this.module}Repository')
const BaseController = use('BaseController')

class ${this.module}Controller extends BaseController {

    constructor() {
        super(${this.module}Repo)
    }

  
    async index({response, view}) {
        let data = {}
        let rows = await ${this.module}Repo.index();
        data.rows = rows ? rows.toJSON() : []
        data.title = "${this.capital}"
        return view.render('admin.${this.kebab}.index', data)
    }

    async create({response, view}) {
        return view.render('admin.${this.kebab}.create', {
            title: "Create ${this.capital}"
        })
    }

    async store({response, view, request, session}) {
        
        let ${this.camel} = await ${this.module}Repo.store(request, response)
        await session.flash({success: '${this.lowercase} created successfully!'})
        return response.redirect('/admin/${this.pluralKebab}');

    }

    async show({response, view, request, session}) {
        let id = request.params.id;
        let row = await ${this.module}Repo.model.find(id);
        if (row == null) {
            await session.flash({error: '${this.lowercase} not found'})
            return response.redirect('back')
        }
        return view.render('admin.${this.kebab}.show', {row: row.toJSON(), title: "${this.capital}"})
    }

    async edit({response, view, request, session}) {
        let id = request.params.id;
        let row = await ${this.module}Repo.model.find(id);
        if (row == null) {
            await session.flash({error: '${this.lowercase} not found'})
            return response.redirect('back')
        }
       
        return view.render('admin.${this.kebab}.edit', {
            row: row.toJSON(),
            title: "Edit ${this.capital}"
        })
    }

    async update({response, view, request, session}) {
        let input = request.except(['_csrf','password_confirmation','_method'])
        let id = request.params.id;
        let row = await ${this.module}Repo.model.find(id);
        if (row == null) {
            await session.flash({error: '${this.lowercase} not found'})
            return response.redirect('back')
        }
        row = await PaymentNotificationRepo.model.query().where({id}).update(input)
        await session.flash({success: '${this.lowercase} updated successfully!'})
        return response.redirect('/admin/${this.pluralKebab}');

    }

    async destroy({response, request, session}) {
        let id = request.params.id;
        let row = await ${this.module}Repo.model.find(id);
        if (row == null) {
            await session.flash({error: '${this.lowercase} not found'})
            return response.redirect('back')
        }
        await row.delete();
        await session.flash({success: '${this.lowercase} Deleted Successfully!'})
        return response.redirect('/admin/${this.pluralKebab}')
    }

}

module.exports = ${this.module}Controller
`

    }



    async resourceIndex() {

        let tableName = this.tableName

        let columns = await Database.table(tableName).columnInfo();
        let colArray = Object.entries(columns);

        let content =  `@layout('admin.layouts.app')
@section('css')
    @super
    <!-- DataTables -->
    {{style(assetsUrl('admin/datatables-bs4/css/dataTables.bootstrap4.min.css'))}}
    {{style(assetsUrl('admin/datatables-responsive/css/responsive.bootstrap4.min.css'))}}
@endsection
@section('content')
    <section class="content">
        <div class="container-fluid">
            @if(flashMessage('error'))
                <div class="alert alert-danger" role="alert">
                    {{ flashMessage('error') }}
                </div>
            @elseif(flashMessage('success'))
                <div class="alert alert-success" role="alert">
                    {{ flashMessage('success') }}
                </div>
            @endif
            <a href="{{baseUrl('admin/${this.kebab}')}}">
                <button class="btn btn-primary">Add New</button>
            </a>
            <div class="card mt-2">
    <div class="card-body">
        <table class="table table-bordered table-striped" id="datatable">
            <thead>
            <tr>`

            if(colArray.length > 0){
                for (let col of colArray){
                    content += `<th>${col[0]}</th>`
                }
                content += `<th>Actions</th>`
            }

            content += `</tr>
            </thead>
            <tbody>
            @!each((row, index) in rows.data,include = 'admin.${this.kebab}.datatable-actions')
            </tbody>
        </table>
    </div>
</div>
        </div>
    </section>
@endsection
@section('scripts')
    @super
   
    <script>
       $(function () {
            dataTableInit('{{title}}')
        });
    </script>
@endsection`

        return content
    }

    resourceCreate() {
        return `@layout('admin.layouts.app')
@section('css')
    @super
@endsection
@section('actions')
    @super
    <div class="btn-group" style="margin-top: -10px;">

        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
            Action
        </button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="{{baseUrl('admin/${this.pluralKebab}')}}">
                <i class="fas fa-arrow-left"></i> Back</a>
        </div>

    </div>
@endsection
@section('content')
    <section class="content">
        <div class="container-fluid">
            @if(flashMessage('error'))
                <div class="alert alert-danger" role="alert">
                    {{ flashMessage('error') }}
                </div>
            @elseif(flashMessage('success'))
                <div class="alert alert-success" role="alert">
                    {{ flashMessage('success') }}
                </div>
            @endif
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <form action="{{baseUrl('admin/${this.kebab}')}}" method="POST">
                                {{ csrfField() }}
                                <div class="row">
                                    @include('admin.${this.kebab}.create-fields')
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


@endsection
@section('scripts')
    @super



@endsection`
    }

    resourceEdit() {
        return `@layout('admin.layouts.app')
@section('css')
    @super
@endsection
@section('actions')
    @super
    <div class="btn-group" style="margin-top: -10px;">

        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
            Action
        </button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="{{baseUrl('admin/${this.pluralKebab}')}}">
                <i class="fas fa-arrow-left"></i> Back</a>
        </div>

    </div>
@endsection
@section('content')
    <section class="content">
        <div class="container-fluid">
            @if(flashMessage('error'))
                <div class="alert alert-danger" role="alert">
                    {{ flashMessage('error') }}
                </div>
            @elseif(flashMessage('success'))
                <div class="alert alert-success" role="alert">
                    {{ flashMessage('success') }}
                </div>
            @endif
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <form action="{{baseUrl('admin/${this.kebab}/')+row.id+"?_method=PUT"}}" method="POST"
                                  enctype="multipart/form-data">
                                {{ csrfField() }}
                                <div class="row">
                                    @include('admin.${this.kebab}.fields')
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
@section('scripts')
    @super
@endsection`
    }

    resourceCreateFields() {
        return `<div class="col-sm-12">
    <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" class="form-control" value="{{ old('title', "") }}" required>
    </div>
</div>

<!--<div class="col-sm-12">-->
    <!--<div class="form-group">-->
        <!--<label>Message</label>-->
        <!--<textarea class="form-control" name="message" id="" cols="30" rows="10"></textarea>-->
    <!--</div>-->
<!--</div>-->

<div class="col-sm-6">
    <button class="btn btn-primary">Send</button>
</div>
`
    }


    resourceFields() {
        return `<div class="col-sm-12">
    <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" class="form-control" value="{{ old('title', row.title) }}" required>
    </div>
</div>

<button type="submit" class="btn btn-primary">Submit</button>
`
    }

    async resourceDatatableActions() {
        let tableName = this.tableName
        let columns = await Database.table(tableName).columnInfo();
        let colArray = Object.entries(columns);

        let content =  `<tr>`

            if(colArray.length>0){
                for (let col of colArray){
                    content += `<td>{{row.${col[0]}}}</td>`
                }

            }
        content += `<td>
        <form action="{{baseUrl('admin/delete-${this.kebab}/')+row.id}}" method="GET">
            <a href="{{baseUrl('admin/${this.kebab}/')+row.id}}" class="btn btn-primary"><i
                        class="fas fa-eye"></i></a>
            <a href="{{baseUrl('admin/edit-${this.kebab}/')+row.id}}" class="btn btn-info"><i
                        class="fas fa-edit"></i></a>
            <a href="#" class="delete-btn btn btn-danger"><i
                        class="fas fa-trash-alt"></i></a>
        </form>
    </td>
</tr>
`
        return content
    }

    resourceShowFields() {
        return `<div class="form-group row">
    <label for="inputName" class="col-sm-2 col-form-label">Title: </label>
    <div class="col-sm-10">
        <p class="col-form-label">{{row.title}}</p>
    </div>
</div>
<div class="form-group row">
    <label for="inputName" class="col-sm-2 col-form-label">Created At: </label>
    <div class="col-sm-10">
        <p class="col-form-label">{{row.created_at}}</p>
    </div>
</div>
<div class="form-group row">
    <label for="inputName" class="col-sm-2 col-form-label">Updated At: </label>
    <div class="col-sm-10">
        <p class="col-form-label">{{row.updated_at}}</p>
    </div>
</div>`
    }

    resourceShow() {
        return `@layout('admin.layouts.app')
@section('css')
    @super
@endsection
@section('actions')
    @super
    <div class="btn-group" style="margin-top: -10px;">

        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
            Action
        </button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="{{baseUrl('admin/edit-${this.kebab}/')+row.id}}">
                <i class="fas fa-edit"></i> Edit</a>
            <a class="dropdown-item" href="{{baseUrl('admin/${this.pluralKebab}')}}">
                <i class="fas fa-arrow-left"></i> Back</a>
            <div class="dropdown-divider"></div>
            <form action="{{baseUrl('admin/delete-${this.kebab}/')+row.id}}" method="GET">
                <a class="dropdown-item btn btn-danger delete-btn" href="#">
                    <i class="fas fa-trash-alt"></i> Delete
                </a>
            </form>
        </div>

    </div>
@endsection
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            @include('admin.${this.kebab}.show-fields')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
@section('scripts')
    @super
@endsection`
    }

}

module.exports = AdminFiles