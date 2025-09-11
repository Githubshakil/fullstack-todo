require("dotenv").config();
const express = require("express");
const databaseConfig = require("./confiq/databaseConfig");
const authRoutes = require("./routes/authRoutes");
// express app
const app = express();

// port number
const port = process.env.PORT || 8000;

//localhost:8000/api/auth/
// database connection
databaseConfig();
app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
// server listening
app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
