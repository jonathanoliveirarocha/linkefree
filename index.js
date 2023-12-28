const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./src/config/db");
require("./src/config/auth")(passport);
const main = require("./src/routes/main");
const auth = require("./src/routes/auth");
const linkpage = require("./src/routes/linkpage");
require("dotenv").config();

const PORT = process.env.PORT | 8000;

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.set("views", path.join(__dirname, "/src/views"));
app.use(express.static(path.join(__dirname + "/src/public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

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

app.use("/", main);
app.use("/auth", auth);
app.use("/linkpage", linkpage);

app.use((req, res, next) => {
  const context = {
    linkpage: true,
  };
  res.render("notfound", context);
});

app.listen(PORT, () => {
  console.log(`Server on at http://localhost:${PORT}`);
});
