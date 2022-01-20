require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
const errorMidleware = require('./middleware/error-middleware')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/', router);
app.use(errorMidleware);

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		app.listen(PORT, console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()