const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const authdetailsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password : {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("authdetails", authdetailsSchema);
