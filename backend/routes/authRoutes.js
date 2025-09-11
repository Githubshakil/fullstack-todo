const express = require("express");
const router = express.Router();
const {
  registrationController,
  loginController,
  verifyTokenController,
  
} = require("../controller/authController");

router.post("/registration", registrationController);
router.post("/verify/:token", verifyTokenController);

router.post("/login", loginController);

module.exports = router;
