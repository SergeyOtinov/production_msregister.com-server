require('dotenv').config()
const https = require('https');
const fs = require('fs');
const express = require('express');
const path =require('path')
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
const errorMidleware = require('./middleware/error-middleware')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}));
app.use('/', router);
app.use(errorMidleware);

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		const sslServer = https.createServer({
			key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
			cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
			}, app)

		sslServer.listen(PORT, () => console.log(`SSL server started on port ${PORT}`))
		// app.listen(PORT, console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()