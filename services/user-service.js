const UserDto = require('../dtos/user-dto');
const User = require('../models/User');
const Role = require('../models/Role');
const tokenService = require('../services/token-service');
const bcrypt = require('bcrypt');
const ApiError = require('../exception/api-error');

class UserService {
	async login(userid, password) {
		const user = await User.findOne({ userid }) || await User.findOne({ email: userid });
		if (!user) {
			throw ApiError.BedRequest(`User with ${userid} not exist!`);
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

	async updateUser(userid, newUserid, email, password, name, surname) {
		const hashPassword = bcrypt.hashSync(password, 7);
		const candidate = await User.findOne({ userid });
		Object.assign(candidate, { userid: newUserid, email, password: hashPassword, name, surname });
		candidate.save();
		return candidate;
	}

	async deleteUser(userid) {
		const candidate = await User.findOneAndDelete({ userid })
		return candidate
	}
}

module.exports = new UserService();