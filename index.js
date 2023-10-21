const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const { loggedIn } = require("./helpers/loggedIn");
const db = require("./config/db");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/User");
require("./config/auth")(passport);
const auth = require("./routes/auth");
const cors = require("cors");
require('dotenv').config();

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  const context = {
    title: "Home",
  };
  res.render("home", context);
});

app.get("/userpage", loggedIn, async (req, res) => {
  const user = await User.findById(req.user);
  const context = {
    title: "Página do Usuário",
    loggedUser: user.username,
  };
  res.render("userpage", context);
});

app.use("/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server on at http://localhost:${PORT}`);
});
