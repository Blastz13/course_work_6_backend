const Router = require('express');
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get('/', authMiddleware, categoryController.getAll);
router.get('/:id', authMiddleware, categoryController.getOne);
router.post('/', checkRole(['SUPERUSER', 'ADMIN', 'INTERNAL']), categoryController.create);
router.put('/:id', checkRole(['SUPERUSER', 'ADMIN', 'INTERNAL']), categoryController.update);
router.delete('/:id', checkRole(['SUPERUSER', 'ADMIN', 'INTERNAL']), categoryController.delete);

module.exports = router;
