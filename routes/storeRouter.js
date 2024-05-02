const Router = require('express');
const storeController = require('../controllers/storeController');
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

const router = new Router();

router.get('/', authMiddleware, storeController.getAll);
router.post('/', checkRoleMiddleware(["SUPERUSER", "ADMIN"]), storeController.create);
router.put('/:id', checkRoleMiddleware(["SUPERUSER", "ADMIN"]), storeController.update);
router.delete('/:id', checkRoleMiddleware(["SUPERUSER", "ADMIN"]), storeController.delete);
router.get('/available', authMiddleware, storeController.getAvailable);
router.get('/:id', authMiddleware, storeController.getOne);


module.exports = router;
