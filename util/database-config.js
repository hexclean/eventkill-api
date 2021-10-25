const { users } = require("./database/Users");
const { meets } = require("./database/Meets");
const { roles } = require("./database/Role");
const { status } = require("./database/Status");

function databaseConfig() {
	users();
	meets();
	roles();
	status();
}

module.exports = { databaseConfig };
