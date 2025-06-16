const express = require("express");

const app = express();

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

app.listen(8000, () => {
  console.log("Server is running on PORT: ", 8000);
});
