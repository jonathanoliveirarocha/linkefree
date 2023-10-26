const mongoose = require("mongoose");
require("dotenv").config();

let temp = "";
const dbPassword = process.env.DB_PASSWORD;

if (process.env.NODE_ENV == "production") {
  temp = dbPassword || "<PRODUCTION-URI>";
} else {
  temp = dbPassword || "<LOCAL-URI>";
}

const url = temp;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));
db.once("open", () => {
  console.log("Connection to MongoDB established!");
});

module.exports = db;
