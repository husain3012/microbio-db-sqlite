const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const user = sequelize.define("user", {
  user_id: {
    type: Sequelize.STRING,
    required: true,
    unique: true,
  },
  level: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = user;

