const userService = require('../services/user-service');
const mailerService = require('../services/mailer-service')
const { validationResult } = require('express-validator');
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

	async createUser(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw ApiError.BedRequest(`Error while creating a new user!`);
			}
			const { userid, email, password, name, surname } = req.body;
			const userData = await userService.createUser(userid, email, password, name, surname);
			return res.json(userData);
		} catch(e) {
			next(e);
		}
	}

	async updateUser(req, res, next) {
		try {
			const { userid, newUserid, email, password, name, surname } = req.body;
			const userData = await userService.updateUser(userid, newUserid, email, password, name, surname);
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { userid } = req.body;
			await userService.deleteUsers(userid);
			if (candidate) {
				return res.json({ message: "User successfully deleted!" });
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

	async mailSend(req, res, next) {
		try {
			const { email, phone, name, company, request, vessel, imo } = req.body;
			mailerService.send(email, phone, name, company, request, vessel, imo)
			return res.json('Email sent successfully!');
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