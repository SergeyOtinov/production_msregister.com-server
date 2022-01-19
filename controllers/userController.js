const User = require('../models/User')
const Role = require('../models/Role')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const { secret } = require("../config")

const generateAccessToken = (id, roles) => { 
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, { expiresIn: "24h"})
}

class UserController {
	async login(req, res, next) {
		try {
			const { userid, password } = req.body
			const user = await User.findOne({ userid })
			if (!user) {
				return next(ApiError.badRequest('User with this userid not exist!'))
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return next(ApiError.badRequest('Incorrect password!'))
			}
			const token = generateAccessToken(user._id, user.roles)
			return res.json({token})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Login error!'})
		}
	}

	async createUser(req, res, next) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({message: "Error while creating a new user", errors})
		}
		const { userid, email, password, name, surname } = req.body
		const candidate = await User.findOne({ userid }) || await User.findOne({ email })
		if (candidate) {
			return next(ApiError.badRequest('User with this userid or email already exists!'))
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
		// const userRole = new Role()
		// const adminRole = new Role({ value: "ADMIN" })
		// await userRole.save()
		// await adminRole.save()
		const users = await User.find()

		return res.json(users)
	}

	async check(req, res) {

	}

	async logout(req, res) {

	}

}

module.exports = new UserController()