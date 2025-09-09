require("dotenv").config();
const express = require("express");
const databaseConfig = require("./confiq/databaseConfig");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 8000;

//localhost:8000/api/auth/

databaseConfig();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(8000, () => {
  console.log(`Server is running on port ${port} `);
});
