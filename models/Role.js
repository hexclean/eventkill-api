const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Role = sequelize.define("Role", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Role;
