const nodemailer = require('nodemailer');

class MailerService {
	async send(mailBody) {
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
			to: 'request@msregister.com',
			subject: 'Data for ELMA365',
			html: mailBody
		};

		transporter.sendMail(mailOption);
	}

	
}

module.exports = new MailerService();