const {Article, User} = require('../models/models')
const ApiError = require('../error/ApiError');
const {Op, DataTypes} = require('sequelize');

class ArticleController {
    async create(req, res, next) {
        const {name, author, article_number, count, categoryId, storeId} = req.body
        const candidate = await Article.findOne({where: {article_number}})
        if (/[!@#$%^&*(),.?":{}|<>]/g.test(name))
            return next(ApiError.badRequest('название содержит специальные символы'))
        if (/[!@#$%^&*(),.?":{}|<>]/g.test(author))
            return next(ApiError.badRequest('имя автора содержит специальные символы'))
        if (candidate)
            return next(ApiError.badRequest('Товар с таким номером уже существует'))

        const article = await Article.create({name, author, article_number, count, categoryId, storeId})
        return res.json(article)
    }

    async getAll(req, res) {
        const {store_id} = req.params
        const query = req.query

        let where = {storeId: store_id}

        if (query.search) {
            where = {
                ...where,
                [Op.or]: [
                    {name: {[Op.like]: `%${query.search}%`}},
                    {author: {[Op.like]: `%${query.search}%`}},
                    {article_number: {[Op.like]: `%${query.search}%`}}
                ]
            }
        }
        if (query.categoryId) {
            where = {
                ...where,
                categoryId: query.categoryId
            }
        }

        const articles = await Article.findAll(
            {
                where
            }
        )
        return res.json(articles)
    }

    async getOne(req, res) {
        const {store_id, obj_id} = req.params
        const article = await Article.findOne(
            {
                where: {
                    storeId: store_id,
                    id: obj_id,
                },
            },
        )
        return res.json(article)
    }

    async update(req, res) {
        const {store_id, obj_id} = req.params
        const {name, author, article_number, count, categoryId, storeId} = req.body

        try {
            const article = Article.update(
                {name, author, article_number, count, categoryId, storeId},
                {
                    where: {
                        id: obj_id,
                        storeId: store_id,
                    }
                }
            )
            res.json(article);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

    async delete(req, res) {
        const {store_id, obj_id} = req.params
        try {
            await Article.destroy({
                where: {
                    id: obj_id,
                    storeId: store_id,
                }
            })
            res.status(204).json();
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

}

module.exports = new ArticleController()
