const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_SCRECT, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "365d",
  });
};

let registrationController =async (req, res) => {
  const {username, email,password} = req.body;
  const hashed = await bcrypt.hash(password,10)
};
let loginController = (req, res) => {
  res.send("ami login");
};

module.exports = { registrationController, loginController };
