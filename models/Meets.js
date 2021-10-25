const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Meets = sequelize.define("Meets", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: Sequelize.STRING,
	startDate: Sequelize.DATE,
	time: Sequelize.STRING,
});

module.exports = Meets;
