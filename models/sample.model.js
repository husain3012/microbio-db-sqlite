const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const sampleSchema = sequelize.define("sample", {
  sample_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  patientName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  sex: {
    type: Sequelize.CHAR,
  },
  cadsNumber: {
    type: Sequelize.NUMBER,
  },
  specimen: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sampleDate: {
    type: Sequelize.DATE,
  },
  department: {
    type: Sequelize.STRING,
  },
  physician: {
    type: Sequelize.STRING,
  },
  diagnosis: {
    type: Sequelize.TEXT,
  },
  examRequired: {
    type: Sequelize.STRING,
  },
  progress: {
    type: Sequelize.STRING,
  },
  remarks: {
    type: Sequelize.TEXT,
  },
  sensitivity: {
    type: Sequelize.JSONB,
  },

});
module.exports = sampleSchema;
