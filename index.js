// imports
const express = require("express");
const connectDB = require("./db/connectDB");
//loading .env
require("dotenv").config();
const app = express();
//middlewares
//routes
//not found
//err handling
//start
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => console.log(`Server running at port ${port}`));
  } catch (error) {}
};
start();
