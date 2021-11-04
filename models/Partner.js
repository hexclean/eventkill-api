const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Partner = sequelize.define("Partner", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startDate: Sequelize.DATE,
});

module.exports = Partner;
