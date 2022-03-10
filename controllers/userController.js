const userService = require('../services/user-service');
const mailerService = require('../services/mailer-service')
class UserController {
	async login(req, res, next) {
		try {
			const { userid, password } = req.body;
			const userData = await userService.login(userid, password);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async updateEmailAdmin(req, res, next) {
		try {
			const { newEmail } = req.body;
			const result = await userService.updateEmailAdmin(newEmail);
			return res.json(result);
		} catch (e) {
			next(e);
		}
	}

	async updatePasswordAdmin(req, res, next) {
		try {
			const { newPassword } = req.body;
			const result = await userService.updatePasswordAdmin(newPassword);
			return res.json(result);
		} catch (e) {
			next(e);
		}
	}

	async createUser(req, res, next) {
		try {
			const { userid, email, password, name, surname } = req.body;
			const userData = await userService.createUser(userid, email, password, name, surname);
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async updateUser(req, res, next) {
		try {
			const { id, userid, email, name, surname } = req.body;
			const userData = await userService.updateUser(id, userid, email, name, surname);
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	async updatePasswordUser(req, res, next) {
		try {
			const { passwordId, newPassword } = req.body;
			const userData = await userService.updatePasswordUser(passwordId, newPassword);
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { id } = req.body;
			const response = await userService.deleteUser(id);
			if (response) {
				const { userid, email } = response;
				return res.json({ message: `User with user ID:${userid} and E-mail:${email} successfully deleted!` });
			} else {
				return res.json({ message: "This user does not exist!" });
			}
		} catch (e) {
			next(e);
		}
	}

	async getUsers(req, res, next) {
		try {
			const users = await userService.getUsers();
			return res.json(users);
		} catch (e) {
			next(e);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await userService.logout(refreshToken);
			res.clearCookie('refreshToken')
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await userService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async requestElma(req, res, next) {
		try {
			const { requestBody } = req.body;
			const { user_email } = requestBody.context;
			const response = mailerService.send(user_email)
			// const response = userService.sendRequestElma(requestBody)
			// if (response) {
			// 	return res.json(`Request sent successfully!, ${response?.data?.success}`);
			// } else {
			// 	return res.json('Server error!');
			// }
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new UserController();

// <----For create database mongodb
// const userRole = new Role()
// const adminRole = new Role({ value: "ADMIN" })
// await userRole.save()
// await adminRole.save()
// --->