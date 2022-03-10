const UserDto = require('../dtos/user-dto');
const User = require('../models/User');
const Role = require('../models/Role');
const tokenService = require('../services/token-service');
const bcrypt = require('bcrypt');
const ApiError = require('../exception/api-error');
const axios = require('axios')
class UserService {
	async login(userid, password) {
		const user = await User.findOne({ userid }) || await User.findOne({ email: userid });
		if (!user) {
			throw ApiError.BedRequest(`User with "${userid}" not exist!`);
		}
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			throw ApiError.BedRequest(`Incorrect password!`);
		}
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto });

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto };
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnathorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			throw ApiError.UnathorizedError();
		}
		const user = await User.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto };
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async updateEmailAdmin(email) {
			const result = await User.findOneAndUpdate({ roles: ["ADMIN"] }, { email });
			return result;
	}

	async updatePasswordAdmin(newPassword) {
		const hashPassword = bcrypt.hashSync(newPassword, 7);
		const result = await User.findOneAndUpdate({ roles: ["ADMIN"] }, { password: hashPassword });
		return result;
	}

	async getUsers() {
		const users = await User.find({ roles: ["USER"] });
		return users;
	}

	async createUser(userid, email, password, name, surname) {
		const candidate = await User.findOne({ userid }) || await User.findOne({ email });
		if (candidate) {
			throw ApiError.BedRequest(`User with this userid or email already exists!`);
		}
		const hashPassword = bcrypt.hashSync(password, 7);
		const userRole = await Role.findOne({ value: "USER" });
		const user = new User({ userid, email, password: hashPassword, name, surname, roles: [userRole.value] });

		await user.save();
		return user;
	}

	async updateUser(id, userid, email, name, surname) {
		const candidate = await User.findByIdAndUpdate(id, { userid, email, name, surname });
		return candidate;
	}
	async updatePasswordUser(passwordId, newPassword) {
		const user = await User.findById(passwordId);
		const hashPassword = bcrypt.hashSync(newPassword, 7);
		const result = await User.findByIdAndUpdate(passwordId, { password: hashPassword });
		return user;
	}

	async deleteUser(id) {
		const candidate = await User.findById(id)
		const removeUser = await User.findByIdAndDelete(id);
		return candidate;
	}

	async sendRequestElma(requestBody) {
		// axios
		// 	.post('http://195.64.240.218/pub/v1/bpm/template/ships/registration_of_survey_work/run', requestBody, {
		// 		headers: {
		// 			'X-Token': '5c1f3a34-d69e-48a0-a6b7-25a9eff4a247',
		// 			'Content-Type': 'application/json'
		// 		}
		// 	})
		// 	.then(res => {
		// 		console.log(res.data.success)

		// 	})
		// 	.catch(error => {
		// 		console.error(error)
		// 	})
	}
}

module.exports = new UserService();