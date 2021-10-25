const CancelledMeets = require("../../models/CancelledMeets");
const Meets = require("../../models/Meets");
const Status = require("../../models/Status");
const JoinedCancelledMeets = require("../../models/JoinedCancelledMeets");
const User = require("../../models/User");

function meets() {
	CancelledMeets.belongsTo(Meets, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "meetId",
	});
	Meets.hasMany(CancelledMeets, { foreignKey: "meetId" });

	Meets.belongsTo(Status, {
		constrains: true,
		onDelete: "CASCADE",
		foreignKey: "statusId",
	});
	Status.hasMany(Meets, { foreignKey: "statusId" });
}

module.exports = { meets };
// Megbeszéljük a következő sprint feladatait és módosításait
