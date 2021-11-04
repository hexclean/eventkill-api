const User = require("../../models/User");
const Meets = require("../../models/Meets");
const Partner = require("../../models/Partner");
// const Partners = require("../../models/Partners");
// const Invitation = require("../../models/Invitation");

function users() {
  Meets.belongsTo(User, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userId",
  });
  User.hasMany(Meets, { foreignKey: "userId" });

  Partner.belongsTo(User, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userId",
  });
  User.hasMany(Partner, { foreignKey: "userId" });
}

module.exports = { users };
