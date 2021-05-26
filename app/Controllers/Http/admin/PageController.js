'use strict'

const PageRepo = use('App/Repositories/PageRepository')
const BaseController = use('BaseController')

class PageController extends BaseController {

    constructor() {
        super(PageRepo)
    }

    async index({request, response, view}) {
        let data = {};
        data.pages = (await PageRepo.model.query().fetch()).toJSON()
        data.title = "Pages"
        return view.render('admin.pages.index', data)
    }


    async create({response, view}) {
        return view.render('admin.pages.create', {
            title: "Create Page",
        })
    }

    async store({response, view, request, session}) {
        await PageRepo.store(request, response)
        await session.flash({success: 'Page created successfully!'})
        return response.redirect('/admin/pages');

    }

    async show({response, view, request, session}) {
        let id = request.params.id;
        let page = await PageRepo.model.find(id);
        if (page == null) {
            await session.flash({error: 'Page not found'})
            return response.redirect('back')
        }
        return view.render('admin.pages.show', {
            page: page.toJSON(),
            title: "Page"
        })
    }

    async edit({response, view, request, session}) {
        let id = request.params.id;
        let page = await PageRepo.model.find(id);
        if (page == null) {
            await session.flash({error: 'Page not found'})
            return response.redirect('back')
        }
        return view.render('admin.pages.edit', {
            page: page.toJSON(),
            title: "Edit Page"
        })
    }

    async update({response, view, request, session}) {
        let id = request.params.id;
        let page = await PageRepo.model.find(id);
        if (page == null) {
            await session.flash({error: 'Page not found'})
            return response.redirect('back')
        }
        await PageRepo.update(id, request)
        await session.flash({success: 'Page updated successfully!'})
        return response.redirect('/admin/pages');

    }

    async destroy({response, request, session}) {
        let id = request.params.id;
        let page = await PageRepo.model.find(id);
        if (page == null) {
            await session.flash({error: 'Page not found'})
            return response.redirect('back')
        }
        await page.delete();
        await session.flash({success: 'Page Deleted Successfully!'})
        return response.redirect('/admin/pages')
    }

    async getPage({request, response, view}) {
        let slug = request.params.slug;
        let page = await PageRepo.model.query().where('slug', slug).first();
        if (page == null) {
            return response.redirect('/404')
        }
        return view.render('admin.pages.template', {page: page.toJSON()})
    }

}

module.exports = PageController