const os = require("os");
const homeDir = os.homedir();
const fs = require("fs");
// make sure the directory exists

if (!fs.existsSync(homeDir + "/micriobioDB")) {
  fs.mkdirSync(homeDir + "/micriobioDB");
}

const Sequelize = require("sequelize");
const database_path = homeDir + "/micriobioDB/database.sqlite";
const sequelize = new Sequelize("microbiodb", "admin", "root", {
  dialect: "sqlite",
  storage: process.env.NODE_ENV === "dev" ? __dirname + "/../database.sqlite" : database_path,
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});

module.exports = sequelize;
