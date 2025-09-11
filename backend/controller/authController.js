const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel.js");
const nodemailer = require("nodemailer");


// email velidation pattern
const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


// nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// generate token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_SCRECT, {
    expiresIn: "15m",
  });
};


// generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "365d",
  });
};


// registration controller
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
  // check user already exits or not
   
  const userExists = await User.findOne({ email: email });
  // console.log(userExits)

  if (userExists) {
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

// verify email controller
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

// login controller

let loginController =async (req, res) => {
  const {email, password} = req.body
  const userExists = await User.findOne({email})
  if (!userExists) {
    return res.send({error: "Invalid credencial"})
  }
  if (!userExists.isVerified) {
    return res.send({error: "please verify your email for login"})
  }
  const isPasswordMatch = await bcrypt.compare(password,userExists.password)
  if (!isPasswordMatch) {
    return res.send({error:"Invalid credencial"})
  }

// generate token
  const accessToken = generateAccessToken(userExists)
  const refreshToken = generateRefreshToken(userExists)
// store refresh token in database
  userExists.refreshToken = refreshToken

  await userExists.save()

  
// store refresh token in cookie


  res.cookie("refreshToken", refreshToken,{
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 365 * 24 * 60* 60* 1000 // 1year validation
    
  })
  res.send({
    massage: "Logine Successfull",
    accessToken: accessToken,
    username: userExists.username,
    email: userExists.email
  })
};

// refresh token controller
const refreshController = async (req,res)=>{
  const token = req.cookies.refreshToken
  if (!token) {
    res.send({error: "No token found"})
  }
  const userExists = await User.findOne({refreshToken : token})
  if (!userExists) {
    return res.send({error: "Invalid Token"})
  }

  jwt.verify(token,  process.env.REFRESH_TOKEN, (err,decoded)=>{
    if (err) {
      return res.send({error: "Invalid token"})
    }
    const accessToken = generateAccessToken(userExists)
    res.send({accessToken})
  })

}
// forgot password controller

const forgotPasswordController = async (req,res) =>{
  const {email} = req.body
  const userExists = await User.findOne({email})
  if (!userExists) {
    return res.send({error: "User not found"})
  }
  try {
    const resetToken = jwt.sign({ id: userExists._id }, process.env.ACCESS_SCRECT, {expiresIn: "15m"});
  const resetLink =`${process.env.CLINT_URL}/reset-password/${resetToken}`
     await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Reset Password`,
      html: `<h3>click to Reset Password <a href='${resetLink}'>Reset Password</a></h3>`
    })

    res.send({massage: "Please check email for reset password"})
  } catch (error) {
    console.log("while sending reset password email ", error);
    res.send({error: "Something went wrong"}) 
  }
}


// reset password controller
const resetPasswordController = async (req,res) =>{
 const {token} = req.params
  const {password} = req.body
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SCRECT)
    const userExists = await User.findById(decoded.id)
    if (!userExists) {
      return res.send({error: "User not found"})
    }
    userExists.password = await bcrypt.hash(password, 10)
    await userExists.save()
    res.send({message: "Password reset successfully"})
  } catch (error) {
    res.send({error: "Invalid Token or expired"})
  }
}

module.exports = { registrationController, loginController, verifyTokenController,refreshController,forgotPasswordController,resetPasswordController };
