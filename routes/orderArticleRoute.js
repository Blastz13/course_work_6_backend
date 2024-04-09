const Router = require('express');
const orderArticleController = require('../controllers/orderArticleController');
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get('/:order_id/article/', authMiddleware, orderArticleController.getAll);
router.get('/:order_id/article/:obj_id', authMiddleware, orderArticleController.getOne);
router.post('/:order_id/article', authMiddleware, orderArticleController.create);
router.put('/:order_id/article/:obj_id', authMiddleware, orderArticleController.update);
router.delete('/:order_id/article/:obj_id', authMiddleware, orderArticleController.delete);

module.exports = router;
