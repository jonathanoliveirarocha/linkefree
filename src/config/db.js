const mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.DATABASE_URI;

mongoose.connect(URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to MongoDB!"));
db.once("open", () => {
  console.log("Connection to MongoDB established!");
});

module.exports = db;