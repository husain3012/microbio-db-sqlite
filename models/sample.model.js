const mongoose = require("mongoose");
const sensitivitySchema = require("./sensitivity.model").schema;
const { ObjectId } = mongoose.Schema;
const sampleSchema = new mongoose.Schema(
  {
    sample_id: {
      type: Number,
      required: true,
      unique: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
    },
    cadsNumber: {
      type: Number,
    },
    specimen: {
      type: String,
      required: true,
    },
    sampleDate: {
      type: Date,
    },
    department: {
      type: String,
    },
    physician: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    examRequired: {
      type: String,
    },
    progress: {
      type: String,
    },
    remarks:{
      type: String
    },
    sensitivity: {
      type: sensitivitySchema,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("sample", sampleSchema);
