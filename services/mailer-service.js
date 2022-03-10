const nodemailer = require('nodemailer');

class MailerService {
	async send(userMail) {
		const transporter = nodemailer.createTransport(
			{
				host: "smtp.gmail.com",
				service: 'gmail',
				secure: true,
				auth: {
				user: process.env.SEND_EMAIL,
				pass: process.env.SEND_PASSWORD
				},
				// tls: {
				// 	rejectUnauthorized: false,
				// },
			}
		);

		const mailOption = {
			from: 'request@msregister.com',
			to: userMail,
			subject: 'The result of your request for ELMA365',
			html: `<h1>Request was sent successfully!</h1>`
		};

		transporter.sendMail(mailOption);
	}

	
}

module.exports = new MailerService();