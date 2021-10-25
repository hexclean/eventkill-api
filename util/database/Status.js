const Status = require("../../models/Status");
const StatusTranslations = require("../../models/StatusTranslations");
const Languages = require("../../models/Languages");

function status() {
	StatusTranslations.belongsTo(Status, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "statusId",
	});
	Status.hasMany(StatusTranslations, { foreignKey: "statusId" });

	StatusTranslations.belongsTo(Languages, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "languageId",
	});
	Languages.hasMany(StatusTranslations, { foreignKey: "languageId" });
}

module.exports = { status };
