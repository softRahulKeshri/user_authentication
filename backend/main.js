const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();

const { createDbConnection } = require("./db/db");
const User = require("./model/User");

const app = express();

// cors
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // if using cookies or auth headers
  })
);

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
    res.status(400).send("First name is required!");
  }

  if (!lastName) {
    res.status(400).send("Last name is required!");
  }

  if (!email) {
    res.status(400).send("Email is required!");
  }

  if (!password) {
    res.status(400).send("Password is required!");
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
  res.status(201).json({ status: true, userInfo, token });
});

app.post("/login", async (req, res) => {

  // 1. Get all the required data
  const { email, password } = req.body;

  // 2. Check data
  if (!email) {
    res.status(400).json({ status: false, messge: "Email is required!" });
  }

  if (!password) {
    res.status(400).json({ status: false, messge: "Password is required!" });
  }

  // 3. Check if user is present or not
  const isUser = await User.findOne({ email });
  console.log(isUser);
  if (!isUser) {
    res.status(400).json({
      status: false,
      messge: "User is not registered, Try to Register first!",
    });
  }

  // 4. Verify the password
  const isPasswordCorrect = await bcrypt.compare(password, isUser.password);
  if (!isPasswordCorrect) {
    res.status(400).json({
      status: false,
      messge: "Incorrect Password, Try Again with correct one!",
    });
  }

  // 5. generate token
  const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: "1h" });

  // 6. Send the response for that along with cookies
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
    })
    .json({ status: true, messge: "Login Successfully!" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT: ", 8000);
});
