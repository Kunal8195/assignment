//**  3rd Party  **//
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otp = new Schema({
  email: { type: String },
  phoneNo: { type: String },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("otp", otp);
