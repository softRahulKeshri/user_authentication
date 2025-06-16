const express = require("express");
require("dotenv").config();

const { createDbConnection } = require("./db/db");

const app = express();

createDbConnection();

app.get("", (req, res) => {
  res.send("Home Page!");
});

// Authentication routes
app.get("/login", (req, res) => {
  res.send("Login Page!");
});

app.get("/signup", (req, res) => {
  res.send("Sign Up Page!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT: ", 8000);
});
