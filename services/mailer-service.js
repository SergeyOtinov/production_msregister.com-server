const nodemailer = require('nodemailer');

class MailerService {
	async send(mailBody) {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: 'gmail',
			secure: true,
			auth: {
				user: process.env.SEND_EMAIL,
				pass: process.env.SEND_PASSWORD
			}
		});
		const mailOption = {
			from: 'admin@navalista.com',
			to: 'admin@navalista.com',
			subject: 'asdadaas',
			html: mailBody
		};

		transporter.sendMail(mailOption);
	}
}

module.exports = new MailerService();