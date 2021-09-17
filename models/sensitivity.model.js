const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const antibioticsSchema = require("./antibiotics.model").schema;
const sensitivitySchema = new mongoose.Schema(
  {
    growthTime: {
      type: Number,
    },
    aerobic: {
      type: Boolean,
    },
    anaerobic: {
      type: Boolean,
    },
    bacterialCount: {
      type: Number,
    },
    staphylococcusName: {
      type: String,
    },
    staphylococcusPanel: {
      type: Array,
    },
    streptococussName: {
      type: String,
    },
    streptococussPanel: {
      type: Array,
    },
    gramNegativeName: {
      type: String,
    },
    gramNegativePanel: {
      type: Array,
    },
    pseudomonasName: {
      type: String,
    },
    pseudomonasPanel: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sensitivity", sensitivitySchema);
