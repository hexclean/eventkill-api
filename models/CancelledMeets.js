const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CancelledMeets = sequelize.define("CancelledMeets", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	status: Sequelize.INTEGER,
	mine: Sequelize.INTEGER,
	accepted: Sequelize.INTEGER,
});

module.exports = CancelledMeets;
