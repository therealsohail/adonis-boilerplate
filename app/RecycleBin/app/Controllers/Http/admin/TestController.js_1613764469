'use strict'
        
const TestRepo = use('App/Repositories/TestRepository')
const BaseController = use('BaseController')

class TestController extends BaseController {

    constructor() {
        super(TestRepo)
    }

  
    async index({response, view}) {
        let data = {}
        let rows = await TestRepo.index();
        data.rows = rows ? rows.toJSON() : []
        data.title = "Test"
        return view.render('admin.test.index', data)
    }

    async create({response, view}) {
        return view.render('admin.test.create', {
            title: "Create Test"
        })
    }

    async store({response, view, request, session}) {
        
        let test = await TestRepo.store(request, response)
        await session.flash({success: 'test created successfully!'})
        return response.redirect('/admin/tests');

    }

    async show({response, view, request, session}) {
        let id = request.params.id;
        let row = await TestRepo.model.find(id);
        if (row == null) {
            await session.flash({error: 'test not found'})
            return response.redirect('back')
        }
        return view.render('admin.test.show', {row: row.toJSON(), title: "Test"})
    }

    async edit({response, view, request, session}) {
        let id = request.params.id;
        let row = await TestRepo.model.find(id);
        if (row == null) {
            await session.flash({error: 'test not found'})
            return response.redirect('back')
        }
       
        return view.render('admin.test.edit', {
            row: row.toJSON(),
            title: "Edit Test"
        })
    }

    async update({response, view, request, session}) {
        let input = request.except(['_csrf','password_confirmation','_method'])
        let id = request.params.id;
        let row = await TestRepo.model.find(id);
        if (row == null) {
            await session.flash({error: 'test not found'})
            return response.redirect('back')
        }
        row = await PaymentNotificationRepo.model.query().where({id}).update(input)
        await session.flash({success: 'test updated successfully!'})
        return response.redirect('/admin/tests');

    }

    async destroy({response, request, session}) {
        let id = request.params.id;
        let row = await TestRepo.model.find(id);
        if (row == null) {
            await session.flash({error: 'test not found'})
            return response.redirect('back')
        }
        await row.delete();
        await session.flash({success: 'test Deleted Successfully!'})
        return response.redirect('/admin/tests')
    }

}

module.exports = TestController
