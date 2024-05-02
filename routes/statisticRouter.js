const Router = require('express');
const statisticController = require('../controllers/statisticController')
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router()


router.get('/orders/:store_id', authMiddleware, statisticController.getOrderStatistic)
router.get('/articles/:store_id', authMiddleware, statisticController.getArticleStatistic)

module.exports = router