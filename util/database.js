const Sequelize = require("sequelize");
const db = {};

sequelize = new Sequelize("defaultdb", "doadmin", "aPzyA6pU92fZRwz5", {
	dialect: "mysql",
	host: "eventkill-do-user-10102277-0.b.db.ondigitalocean.com",
	port: 25060,
	operatorsAliases: false,
	logging: false,
});

// sequelize = new Sequelize("defaultdb", "doadmin", "qxmneGDxwVXnq7P5", {
// 	host: "eventkill-do-user-10102277-0.b.db.ondigitalocean.com",
// 	dialect: "mysql",
// operatorsAliases: false,
// logging: false,
// 	port: 25060,
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = sequelize;
