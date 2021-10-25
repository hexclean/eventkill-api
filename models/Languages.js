const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Languages = sequelize.define("Languages", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: Sequelize.STRING,
});

module.exports = Languages;
