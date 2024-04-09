const {Article, OrderArticle} = require('../models/models')

class ArticleController {
    async create(req, res) {
        const {name, author, article_number, count, categoryId, orderId} = req.body
        const article = await OrderArticle.create({name, author, article_number, count, categoryId, orderId})
        return res.json(article)
    }

    async getAll(req, res) {
        const {order_id} = req.params
        const orderArticle = await OrderArticle.findAll(
            {
                where: {orderId: order_id}
            }
        )
        return res.json(orderArticle)
    }

    async getOne(req, res) {
        const {order_id, obj_id} = req.params
        const orderArticle = await OrderArticle.findOne(
            {
                where: {
                    orderId: order_id,
                    id: obj_id,
                },
            },
        )
        return res.json(orderArticle)
    }

    async update(req, res) {
        const {order_id, obj_id} = req.params
        const {name, author, article_number, count, categoryId, orderId} = req.body

        try {
            const orderArticle = OrderArticle.update(
                {name, author, article_number, count, categoryId, orderId},
                {
                    where: {
                        id: obj_id,
                        orderId: order_id,
                    }
                }
            )
            res.json(orderArticle);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

    async delete(req, res) {
        const {order_id, obj_id} = req.params
        try {
            await OrderArticle.destroy({
                where: {
                    id: obj_id,
                    orderId: order_id,
                }
            })
            res.status(204).json();
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }

}

module.exports = new ArticleController()
