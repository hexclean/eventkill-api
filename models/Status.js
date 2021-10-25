const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Status = sequelize.define("Status", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Status;
