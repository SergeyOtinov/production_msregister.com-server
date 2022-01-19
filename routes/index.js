const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')

router.use('/api', userRouter)

module.exports = router