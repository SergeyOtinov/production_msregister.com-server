const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth-middleware')

router.post('/login', userController.login)
router.post('/update-admin-email', userController.updateEmailAdmin)
router.post('/update-admin-password', userController.updatePasswordAdmin)
router.post('/create', userController.createUser)
router.post('/update', userController.updateUser)
router.post('/update-password', userController.updatePasswordUser)
router.post('/delete', userController.deleteUser)
router.post('/send', userController.mailSend)
router.get('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router
