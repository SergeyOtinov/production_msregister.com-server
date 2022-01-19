const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/create', userController.createUser)
router.post('/update', userController.updateUser)
router.post('/delete', userController.deleteUser)
router.get('/logout', userController.logout)
router.get('/auth', userController.check)
router.get('/users', userController.getUsers)

module.exports = router