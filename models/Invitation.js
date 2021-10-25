const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Invitation = sequelize.define("Invitation", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	generatedCode: Sequelize.STRING,
	status: Sequelize.INTEGER,
});

module.exports = Invitation;
