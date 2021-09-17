const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const antibioticsSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  panel: {
    type: String,
  },
});
module.exports = mongoose.model("Antibiotics", antibioticsSchema);
