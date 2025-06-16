const mongoose = require("mongoose");
require("dotenv").config();

const createDbConnection = async () => {
  const MongodbConnectionString = process.env.MONGODB_URL;
  try {
    await mongoose.connect(MongodbConnectionString);
    console.log("DB connected successfully!");
  } catch {
    console.log("DB connection failed!");
  }
};

module.exports = { createDbConnection };
