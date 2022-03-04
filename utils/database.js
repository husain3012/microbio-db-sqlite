const Sequelize = require("sequelize");
console.log(__dirname);
const sequelize = new Sequelize("microbiodb", "admin", "root", {
  dialect: "sqlite",
  storage: __dirname + "/../database.sqlite",
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});

module.exports = sequelize;
