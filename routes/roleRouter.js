const Router = require('express')
const roleController = require('../controllers/roleController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router()

router.get('/', authMiddleware, roleController.getAll)
router.get('/:id', authMiddleware, roleController.getOne)
router.post('/', checkRole(['SUPERUSER']), roleController.create)
router.put('/:id', checkRole(['SUPERUSER']), roleController.update)
router.delete('/:id', checkRole(['SUPERUSER']), roleController.delete)

module.exports = router
