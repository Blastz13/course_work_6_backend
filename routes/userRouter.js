const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const hasObjectOrAdmin = require('../middleware/hasObjectOrAdmin')
const {User} = require("../models/models");
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.get('/auth', authMiddleware, userController.check)
router.get('/', authMiddleware, userController.getAll)
router.get('/:id', userController.getOne);
router.put('/perms/:id', userController.updateAdmin)
router.put('/:id', hasObjectOrAdmin(User), userController.update);
router.delete('/:id', hasObjectOrAdmin(User), userController.delete);

module.exports = router;
