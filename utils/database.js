const Sequelize = require("sequelize");
const database_path = process.env.DATABASE_LOCATION || "./database.sqlite";
const sequelize = new Sequelize("microbiodb", "admin", "root", {
  dialect: "sqlite",
  storage: process.env.NODE_ENV === "dev" ? __dirname + "/../database.sqlite" : database_path,
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});

module.exports = sequelize;
