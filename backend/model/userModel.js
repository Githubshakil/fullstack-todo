const mongoose = require("mongoose");
const { schema } = mongoose;

const userSchema = new schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
