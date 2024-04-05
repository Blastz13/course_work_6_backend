const Router = require('express');
const articleController = require('../controllers/articleController');
const relatedToStoreOrAdminMiddleware = require("../middleware/relatedToStoreOrAdminMiddleware");

const router = new Router();

router.get('/:store_id/article/', relatedToStoreOrAdminMiddleware, articleController.getAll);
router.get('/:store_id/article/:obj_id', relatedToStoreOrAdminMiddleware, articleController.getOne);
router.post('/:store_id/article', relatedToStoreOrAdminMiddleware, articleController.create);
router.put('/:store_id/article/:obj_id', relatedToStoreOrAdminMiddleware, articleController.update);
router.delete('/:store_id/article/:obj_id', relatedToStoreOrAdminMiddleware, articleController.delete);

module.exports = router;
