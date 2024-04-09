const Router = require('express')
const orderController = require('../controllers/orderController')
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get('/admin', authMiddleware, orderController.getAllAdmin);
router.get('/burse/internal/:store_id', authMiddleware, orderController.getInternalBurse);
router.get('/burse/internal/:store_id/my', authMiddleware, orderController.getInternalBurseMy)
router.get('/burse/external', authMiddleware, orderController.getExternalBurse);
router.get('/burse/external/my', authMiddleware, orderController.getExternalBurseMy)

router.get('/internal/:store_id', authMiddleware, orderController.getInternalOrders);
router.get('/external', authMiddleware, orderController.getExternalOrders);
router.get('/last/internal/:store_id', authMiddleware, orderController.getLastInternalOrders);
router.get('/last/external', authMiddleware, orderController.getLastExternalOrders);
router.post('/internal/:store_id', authMiddleware, orderController.createInternalOrder);
router.post('/external', authMiddleware, orderController.createExternalOrder);
router.post('/:id/internal/:store_id/perform', authMiddleware, orderController.performInternalOrder);
router.post('/:id/external/perform', authMiddleware, orderController.performExternalOrder);
router.get('/:id', authMiddleware, orderController.getOne);

router.post('/:id/confirm', authMiddleware, orderController.confirmOrder);

router.get('/', orderController.getAll);
router.post('/', orderController.create);
router.get('/all', orderController.getAll);

module.exports = router
