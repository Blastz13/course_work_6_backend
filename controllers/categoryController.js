const {Category, Store, Article} = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async create(req, res, next) {
        const {name} = req.body
        const candidate = await Category.findOne({where: {name}})
        if (/[!@#$%^&*(),.?":{}|<>]/g.test(name))
            return next(ApiError.errorRequest('название содержит специальные символы'))
        if (candidate)
            return next(ApiError.errorRequest('такая категория уже существует'))
        const category = await Category.create({name})
        return res.json(category)
    }

    async getAll(req, res) {
        const categories = await Category.findAll()
        return res.json(categories)
    }

    async getOne(req, res) {
        const {id} = req.params
        const category = await Category.findOne(
            {
                where: {
                    id: id,
                }
            },
        )
        return res.json(category)
    }

    async update(req, res) {
        const {id} = req.params
        const {name} = req.body;

        try {
            const category = Category.update(
                {name: name},
                {
                    where: {
                        id: id
                    }
                }
            )
            res.json(category);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

    async delete(req, res) {
        const {id} = req.params

        try {
            await Category.destroy({
                where: {
                    id: id
                }
            })
            res.status(204).json();
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

}

module.exports = new CategoryController()
