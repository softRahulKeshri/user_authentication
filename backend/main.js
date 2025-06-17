const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { createDbConnection } = require("./db/db");
const User = require("./model/User");

const app = express();

// middlewares
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

createDbConnection();

app.get("", (req, res) => {
  res.send("Home Page!");
});

// Authentication routes
app.post("/register", async (req, res) => {
  //1. Get all the required data from the frontend / client
  const { firstName, lastName, email, password } = req.body;

  //2. Check that all data is passed
  if (!firstName) {
    res.send("First name is required!");
  }

  if (!lastName) {
    res.send("Last name is required!");
  }

  if (!email) {
    res.send("Email is required!");
  }

  if (!password) {
    res.send("Password is required!");
  }

  //3. Check if the user is already present in the DB
  const isUserAlreadyExist = await User.findOne({
    email,
  });

  if (isUserAlreadyExist) {
    res.send("User is Already Present!");
  }

  //4. Hased the password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  //5. Save the user on DB
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  //6. Create and send JWT Token
  const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_KEY, {
    expiresIn: "10m",
  });

  const userInfo = {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };

  //7. Send User
  res.status(200).json({ status: true, userInfo, token });
});

app.get("/login", (req, res) => {
  res.send("Sign Up Page!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT: ", 8000);
});
