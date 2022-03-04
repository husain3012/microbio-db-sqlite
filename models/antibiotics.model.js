const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const antibiotics = sequelize.define("antibiotics", {
  shortName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
  },

  panel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = antibiotics;
