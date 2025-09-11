const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel.js")

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

let registrationController = async (req, res) => {
  const { username, email, password } = req.body;

  const userExits = await User.find({email: email})
  // console.log(userExits)

  if (userExits) {
   return res.send({error: `${email} already exits`})
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    username: username,
    email: email,
    password: hashed,
    isVerified: false,
  });

  try {
    await user.save();
    res.send({
      message:
        "Registration Successful. Please check your email for verification",
    });
  } catch (error) {
    console.log(error)
    // res.send({error: `${email} already exits`})
  }
};

let loginController = (req, res) => {
  res.send("ami login");
};

module.exports = { registrationController, loginController };
