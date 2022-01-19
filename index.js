const express = require('express')
const mongoose = require('mongoose');
const router = require('./routes/index')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/', router)

const start = async () => {
	try {
		await mongoose.connect('mongodb+srv://admin:N18adCNEz@msregister.fljdj.mongodb.net/msregister?retryWrites=true&w=majority')
		app.listen(PORT, console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()