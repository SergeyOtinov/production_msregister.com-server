const { Schema, model } = require('mongoose')

const User = new Schema({
	userid: { type: String, unique: true, required: true },
	email: { type: String, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	surname: { type: String },
	roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', User)