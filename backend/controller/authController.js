const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel.js");
const nodemailer = require("nodemailer");


const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  let errors = {
    uasenameError: "",
    emailError: "",
    passwordError:"",
    
  }

  // username email password start velidation
  if (!username) {
    errors.uasenameError = "User name required"
  }
  if (!email) {
    errors.emailError = "email requird"
  }
  if (!password) {
    errors.passwordError = "password required"
  }
  
if (!pattern.test(email)) {
  errors.emailError = 'Please Enter a valid email'
}

if (errors.uasenameError||errors.emailError||errors.passwordError) {
  res.send({errors})
}

  // username email password end velidation




  const userExits = await User.findOne({ email: email });
  // console.log(userExits)

  if (userExits) {
    return res.send({ error: `${email} already exits` });
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
    const verificationToken = jwt.sign({ id: user._id },process.env.ACCESS_SCRECT,{expiresIn: "1d",});
    const verifylink = `${process.env.CLINT_URL}/verify/${verificationToken}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `${user.username} please verify your email`,
      html: `<h3>click to verify your account <a href='${verifylink}'>verify mail</a></h3>`
    })
    res.send({message:"Registration Successful. Please check your email for verification",});
  } catch (error) {
    console.log("while trying to save data in database ", error);
  }
};


let verifyTokenController = async (req,res) =>{
   const {token} = req.params
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SCRECT)
    const userExits = await User.findById(decoded.id)
    if (!userExits) {
      return res.send({error: " Invalid Token"})
    }
    userExits.isVerified = true
    userExits.save()

    res.send({message:"Email verified successfully ",});
  } catch (error) {
    res.send({error: " Invalid Token or expired"})
  }
}

let loginController = (req, res) => {
 
};

module.exports = { registrationController, loginController, verifyTokenController };
