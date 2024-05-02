const {Order, Article} = require("../models/models");
const {Op} = require('sequelize');

class StatisticController {

    async getCurrentCreatedOrders(req, res) {
        const {store_id} = req.params
        const orders = await Order.findAll({
            limit: 5,
            where: {
                status: 'CREATED',
                destinationId: store_id
            },
            order: [
                ['updatedAt', 'DESC']
            ]
        });
        return res.json(orders);
    }

    async getOrderStatistic(req, res) {
        const {store_id} = req.params
        const {type} = req.query
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let count_arrive_orders = [];
        let count_send_orders = [];
        let dates = []
        if (req.user.role.name === "EXTERNAL") {
            for (let i = 0; i < 7; i++) {
                let temp = await Order.count({
                        where: {
                            status: 'DONE',
                            destinationUserId: store_id,
                            date_arrive: date
                        }
                    }
                );
                count_arrive_orders.push(temp);
                temp = await Order.count({
                        where: {
                            status: 'DONE',
                            sourceUserId: store_id,
                            date_arrive: date
                        }
                    }
                );
                count_send_orders.push(temp);
                dates.push(new Date(date));
                date.setDate(date.getDate() - 1);
            }
        } else {
            for (let i = 0; i < 7; i++) {
                let temp = await Order.count({
                        where: {
                            status: 'DONE',
                            destinationId: store_id,
                            date_arrive: date
                        }
                    }
                );
                count_arrive_orders.push(temp);
                temp = await Order.count({
                        where: {
                            status: 'DONE',
                            sourceId: store_id,
                            date_arrive: date
                        }
                    }
                );
                count_send_orders.push(temp);
                dates.push(new Date(date));
                date.setDate(date.getDate() - 1);
            }
        }
        return res.json({
            dates: dates,
            count_arrive_orders: count_arrive_orders,
            count_send_orders: count_send_orders
        });
    }

    async getArticleStatistic(req, res) {
        const {store_id} = req.params
        const {type} = req.query
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let count = [];
        let names = []
        let articles = await Article.findAll({
            where: {
                storeId: store_id
            }
        })

        articles.map(article => {
            let artilce_json = article.toJSON()
            names.push(artilce_json.name)
            count.push(artilce_json.count)
        })


        return res.json({
            names: names,
            count: count,
        });
    }

}


module.exports = new StatisticController()