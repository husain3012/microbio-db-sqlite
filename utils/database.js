shell = new ActiveXObject("WScript.Shell");
pathToMyDocuments = shell.SpecialFolders("MyDocuments");
console.log(pathToMyDocuments);
const isWin = process.platform === "win32";

const Sequelize = require("sequelize");
const database_path = isWin ? pathToMyDocuments + "/microbioDB.sqlite" : "./microbioDB.sqlite";
const sequelize = new Sequelize("microbiodb", "admin", "root", {
  dialect: "sqlite",
  storage: process.env.NODE_ENV === "dev" ? __dirname + "/../database.sqlite" : database_path,
  logging: process.env.NODE_ENV === "dev" ? console.log : false,
});

module.exports = sequelize;
