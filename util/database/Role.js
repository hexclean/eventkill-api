const User = require("../../models/User");
const Role = require("../../models/Role");
const RoleTranslations = require("../../models/RoleTranslations");
const Languages = require("../../models/Languages");

function roles() {
	User.belongsTo(Role, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "roleId",
	});
	Role.hasMany(User, { foreignKey: "roleId" });

	RoleTranslations.belongsTo(Languages, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "languageId",
	});
	Languages.hasMany(RoleTranslations, { foreignKey: "languageId" });
}

module.exports = { roles };
