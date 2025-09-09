const mongoose = require("mongoose");

let databaseConfig = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Database connection error:", err);
    });
};

module.exports = databaseConfig;
