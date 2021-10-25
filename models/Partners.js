const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Partners = sequelize.define("Partners", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	
});

module.exports = Partners;
