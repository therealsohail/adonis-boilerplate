'use strict'

const PageRepo = use('App/Repositories/PageRepository')
const BaseController = use('BaseController')

class PageController extends BaseController {

    constructor() {
        super(PageRepo)
    }

    async index({request, response}) {
        let offset = request.input('offset', null)
        let limit = request.input('limit', null)
        let input = request.only(['slug']);
        let pages = await PageRepo.model.query().where(input).offset(parseInt(offset)).limit(parseInt(limit)).fetch()
        return response.json({
            status: true,
            data: pages.toJSON(),
            message: "Pages retrieved successfully"
        })
    }

    async show({request, response}) {
        let page = await PageRepo.model.find(request.params.id)
        if (page == null) {
            return response.status(403).json({status: false, message: "Page not found"})
        }
        return response.json({
            status: true,
            data: page,
            message: "Page retrieved successfully"
        })
    }

    async getPage({request, response}) {
        let page = await PageRepo.model.query().where('slug', request.params.slug).first()
        if (page == null) {
            return response.status(403).json({status: false, message: "Page not found"})
        }
        return response.json({
            status: true,
            data: page,
            message: "Page retrieved successfully"
        })
    }
}

module.exports = PageController