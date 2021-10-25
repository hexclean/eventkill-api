const User = require("../../models/User");
const Meets = require("../../models/Meets");
const CancelledMeets = require("../../models/CancelledMeets");
const Partners = require("../../models/Partners");
const Invitation = require("../../models/Invitation");

function users() {
	Meets.belongsTo(User, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "userId",
	});
	User.hasMany(Meets, { foreignKey: "userId" });

	CancelledMeets.belongsTo(User, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "userId",
	});
	User.hasMany(CancelledMeets, { foreignKey: "userId" });

	Invitation.belongsTo(User, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "userId",
	});
	User.hasMany(Invitation, { foreignKey: "userId" });

	Partners.belongsTo(Invitation, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "invitationId",
	});
	Invitation.hasMany(Partners, { foreignKey: "invitationId" });

	Partners.belongsTo(User, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "userId",
	});
	User.hasMany(Partners, { foreignKey: "invitationId" });
}

module.exports = { users };
