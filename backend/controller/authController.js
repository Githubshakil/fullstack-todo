let registrationController = (req, res) => {
  res.send("ami registration");
};
let loginController = (req, res) => {
  res.send("ami login");
};

module.exports = { registrationController, loginController };
