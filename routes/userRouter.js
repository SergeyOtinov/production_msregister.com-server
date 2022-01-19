const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/login',userController.login)
router.post('/create', [
	check("userid", "The userid field cannot be empty!").notEmpty(),
	check("password", "Password must be no more than twelve characters and no less than four!").isLength({min: 4, max: 12})
	],
	userController.createUser)
router.post('/update', userController.updateUser)
router.post('/delete', userController.deleteUser)
router.get('/logout', userController.logout)
router.get('/auth', userController.check)
router.get('/users', roleMiddleware(['ADMIN']), userController.getUsers)

module.exports = router