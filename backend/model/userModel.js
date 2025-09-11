const mongoose = require("mongoose");

  // user schema 
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  refreshToken: String,
  isVerified : Boolean,
});

module.exports = mongoose.model("User", userSchema);
