require('dotenv').config()
const express = require('express');
const https = require("https")
const fs = require("fs")
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
const errorMidleware = require('./middleware/error-middleware')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000

const httpsOptions = {
	key: fs.readFileSync('../certificates/key.pem'),
	cert: fs.readFileSync('../certificates/cert.pem')
};

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	credentials: true,
	origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_WWW]
}));
app.use('/', router);
app.use(errorMidleware);

const start = async () => {
		try {
			await mongoose.connect(process.env.DB_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} catch (e) {
			console.log(e)
		}
	}

https.createServer(httpsOptions, app).listen(PORT, console.log(`server started on port ${PORT}`));

start()