const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const StatusTranslations = sequelize.define("StatusTranslations", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: Sequelize.STRING,
});

module.exports = StatusTranslations;
