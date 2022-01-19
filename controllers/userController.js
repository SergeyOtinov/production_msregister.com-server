const User = require('../models/User')
const Role = require('../models/Role')
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
			const user = await User.findOne({ userid }) || await User.findOne({ email: userid })

			if (!user) {
				return res.status(400).json({message: 'User with this userid not exist!'})
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({message: 'Incorrect password!'})
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
			return res.status(400).json({message: 'User with this userid or email already exists!'})
		}
		const hashPassword = bcrypt.hashSync(password, 7)
		const userRole = await Role.findOne({value: "USER"})
		const user = new User({ userid, email, password: hashPassword, name, surname, roles: [userRole.value] })
		
		await user.save()
		return res.json({message: "User successfully created!"})
	}

	async updateUser(req, res, next) {
		try {
			const { userid, newUserid, email, password, name, surname } = req.body
			const hashPassword = bcrypt.hashSync(password, 7)
			const candidate = await User.findOne({ userid })
			Object.assign(candidate, { userid: newUserid, email, password: hashPassword, name, surname })
			candidate.save()

			return res.json({ message: "Changes saved!" })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Error with update user!' })
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { userid } = req.body
			const candidate = await User.findOneAndDelete({ userid })
			if (candidate) {
				return res.json({message: "User successfully deleted!"})
			} else {
				return res.json({message: "This user does not exist!"})
			}
		} catch (e) {
			console.log(e)
			res.status(400).json({message: 'Error with delete user!'})
		}
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

// <----For create database mongodb
// const userRole = new Role()
// const adminRole = new Role({ value: "ADMIN" })
// await userRole.save()
// await adminRole.save()
// --->