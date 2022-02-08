module.exports = class UserDto {
	email;
	id;
	userid;
	roles;

	constructor(model) {
		this.email = model.email;
		this.id = model._id;
		this.userid = model.userid;
		this.roles = model.roles;
	}
}