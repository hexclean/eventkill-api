const Partner = require("../../models/Partner");
const Meets = require("../../models/Meets");
const Status = require("../../models/Status");

function meets() {
  Partner.belongsTo(Meets, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "meetId",
  });
  Meets.hasMany(Partner, { foreignKey: "meetId" });

  Meets.belongsTo(Status, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "statusId",
  });
  Status.hasMany(Meets, { foreignKey: "statusId" });

  Partner.belongsTo(Status, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "statusId",
  });
  Status.hasMany(Partner, { foreignKey: "statusId" });
}

module.exports = { meets };
