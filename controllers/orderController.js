const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, Order, Category, Role, Store, OrderArticle, Article} = require('../models/models')
const {Op} = require('sequelize');
const ApiError = require('../error/ApiError');

class OrderController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const device = await Device.create({name, price, brandId, typeId, img: fileName});

            return res.json(device);
        } catch (e) {
            next(ApiError.badRequest("введены некоректные данные"));
        }
    }

    async createInternalOrder(req, res, next) {
        try {
            let {date_arrive} = req.body
            let {store_id} = req.params
            const order = await Order.create({
                date_arrive: date_arrive,
                status: "CREATED",
                order_type: "INTERNAL",
                destinationId: store_id
            });
            return res.json(order);
        } catch (e) {
            next(ApiError.badRequest("введены некоректные данные"));
        }
    }

    async createExternalOrder(req, res, next) {
        try {
            let order;
            if (req.user.role.name === "EXTERNAL") {
                order = await Order.create({
                    date_arrive: req.body.date_arrive,
                    status: "CREATED",
                    order_type: "EXTERNAL",
                    destinationUserId: req.user.id
                });
            } else {
                order = await Order.create({
                    date_arrive: req.body.date_arrive,
                    status: "CREATED",
                    order_type: "EXTERNAL",
                    destinationId: req.body.storeId
                });
            }
            return res.json(order);
        } catch (e) {
            next(ApiError.badRequest("введены некоректные данные"));
        }
    }

    async performInternalOrder(req, res) {
        const {id, store_id} = req.params
        try {
            const order = Order.update(
                {
                    status: "ACCEPTED",
                    sourceId: store_id
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            res.json(order);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"});
        }
    }

    async performExternalOrder(req, res) {
        const {id} = req.params;

        try {
            let order;
            if (req.user.role.name === "EXTERNAL")
                order = Order.update(
                    {
                        status: "ACCEPTED",
                        sourceUserId: req.user.id
                    },
                    {
                        where: {
                            id: id
                        }
                    }
                )
            res.json(order);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"});
        }
    }

    async getAllAdmin(req, res) {
        const orders = await Order.findAll();
        return res.json(orders);
    }

    async getInternalBurseMy(req, res) {
        const {store_id} = req.params
        const orders = await Order.findAll({
            where: {
                status: 'CREATED',
                destinationId: store_id
            },
        });
        return res.json(orders);
    }

    async getInternalBurse(req, res) {
        const {store_id} = req.params
        const orders = await Order.findAll({
            where: {
                status: 'CREATED',
                [Op.or]: [
                    {
                        order_type: "INTERNAL",
                        destinationId: {
                            [Op.not]: store_id
                        }
                    },
                    {
                        order_type: "EXTERNAL",
                        destinationUserId: {
                            [Op.not]: null
                        }
                    }

                ]

            },
        });
        return res.json(orders);
    }


    async getExternalBurseMy(req, res) {
        const orders = await Order.findAll({
            where: {
                status: 'CREATED',
                order_type: "EXTERNAL",
                destinationUserId: req.user.id
            },
        });
        return res.json(orders);
    }

    async getExternalBurse(req, res) {
        const orders = await Order.findAll({
            where: {
                status: 'CREATED',
                order_type: "EXTERNAL",
                destinationUserId: {
                    [Op.or]: {
                        [Op.not]: req.user.id,
                        [Op.is]: null
                    }
                }

            },
        });
        return res.json(orders);
    }

    async getInternalOrders(req, res) {
        const {store_id} = req.params;
        const {page_size, page} = req.query

        let request_body = {}

        if (page_size && page) {
            request_body = {
                ...request_body,
                limit: page_size,
                offset: (page - 1) * page_size
            }
        }

        let where = {
            status: {
                [Op.not]: "CREATED",
            },
            [Op.or]: [
                {destinationId: store_id},
                {sourceId: store_id}
            ]
        }

        request_body = {
            ...request_body,
            where: where,
            order: [
                ['updatedAt', 'DESC']
            ]
        }

        const orders = await Order.findAll(request_body);
        return res.json(orders);
    }

    async getExternalOrders(req, res) {
        const userId = req.user.id
        const orders = await Order.findAll({
            where: {
                [Op.or]: [
                    {destinationUserId: userId},
                    {sourceUserId: userId},
                ]
            }
        });
        return res.json(orders);
    }

    async getLastInternalOrders(req, res) {
        const {store_id} = req.params;
        const orders = await Order.findAll(
            {
                limit: 10,
                where: {
                    status: "ACCEPTED",
                    [Op.or]: [
                        {destinationId: store_id},
                        {sourceId: store_id}
                    ]
                },
                order: [['updatedAt', 'DESC']]
            }
        );
        return res.json(orders);
    }

    async getLastExternalOrders(req, res) {
        const userId = req.user.id
        const orders = await Order.findAll(
            {
                limit: 10,
                where: {
                    status: "ACCEPTED",
                    order_type: "EXTERNAL",
                    [Op.or]: [
                        {destinationUserId: userId},
                        {sourceUserId: userId}
                    ]
                },
                order: [['updatedAt', 'DESC']]
            }
        );
        return res.json(orders);
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const order = await Order.findOne(
            {
                where: {id},
                include: [
                    {model: OrderArticle},
                ]
            },
        )
        return res.json(order)
    }

    async confirmOrder(req, res) {
        const {id} = req.params
        const order = await Order.findOne(
            {
                where: {
                    id: id,
                    [Op.not]: {
                        status: 'DONE'
                    }
                },
                include: [
                    {model: OrderArticle},
                    {model: Store, as: 'destinationWarehouse'},
                    {model: Store, as: 'sourceWarehouse'},
                ]
            },
        )
        if (order) {
            order.status = "DONE";
            await order.save()
        } else {
            return res.status(400).json("Was done")
        }
        for (let count = 0; count < order.order_articles.length; count++) {
            const articles = order.order_articles[count]
            if (order.destinationId) {
                const articleDist = await Article.findOne(
                    {
                        where: {
                            article_number: articles.article_number,
                            storeId: order.destinationId
                        },
                    },
                )
                if (articleDist) {
                    articleDist.count += articles.count
                    await articleDist.save()
                } else {
                    await Article.create({
                        name: articles.name,
                        author: articles.author,
                        article_number: articles.article_number,
                        count: articles.count,
                        storeId: order.destinationId,
                        categoryId: articles.categoryId
                    });
                }
            }

            if (order.sourceId) {
                const articleSource = await Article.findOne(
                    {
                        where: {
                            article_number: articles.article_number,
                            storeId: order.sourceId
                        },
                    },
                )
                if (articleSource) {
                    articleSource.count -= articles.count
                    await articleSource.save()
                }
            }

        }
        return res.json(order)
    }
}

module.exports = new OrderController()
