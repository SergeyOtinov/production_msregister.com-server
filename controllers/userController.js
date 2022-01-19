const User = require('../models/User')
const Role = require('../models/Role')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')

class UserController {
	async login(req, res, next) {
		try {

		} catch {
			console.log(e)
			res.status(400).json({message: 'Login error!'})
		}
	}

	async createUser(req, res, next) {
		const { userid, email, password, name, surname } = req.body
		if (!userid || !password) {
			return next(ApiError.badRequest('Incorrect email or password!'))
		}
		const candidate = await User.findOne({ userid })
		if (candidate) {
			return next(ApiError.badRequest('User with this email already exists!'))
		}
		const hashPassword = bcrypt.hashSync(password, 7)
		const userRole = await Role.findOne({value: "USER"})
		const user = new User({ userid, email, password: hashPassword, name, surname, roles: [userRole.value] })
		await user.save()
		return res.json({message: "User successfully created!"})
	}

	async updateUser(req, res) {

	}

	async deleteUser(req, res, next) {

	}

	async getUsers(req, res) {
		const users = await User.find()

		return res.json(users)
	}

	async check(req, res) {

	}

	async logout(req, res) {

	}

}

module.exports = new UserController()