const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const JoinedCancelledMeets = sequelize.define("JoinedCancelledMeets", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	status: Sequelize.INTEGER,
});

module.exports = JoinedCancelledMeets;
