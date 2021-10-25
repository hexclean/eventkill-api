const express = require("express");
const app = express();
const config = require("config");
const sequelize = require("./util/database");
const { databaseConfig } = require("./util/database-config");
var cors = require("cors");

databaseConfig();

app.use(cors());
app.options("*", cors());
const PORT = process.env.PORT || config.get("port");
console.log("PORT", PORT);
app.use(express.json({ extended: false }));

app.use("/api/meets", require("./api/meets"));
app.use("/api/auth", require("./api/auth"));
app.use("/api/operation", require("./api/operation"));
app.use("/api/profile", require("./api/profile"));

sequelize
	.sync()
	.then(result => {
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	})
	.catch(err => {
		console.log(err);
	});
