const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
          if (!user) {
            return done(null, false, { message: "Esta conta não existe!" });
          } else {
            bcrypt.compare(password, user.password, (err, logged) => {
              if (logged) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Senha incorreta!" });
              }
            });
          }
        });
      }
    )
  );
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user.id);
    })
    .catch((error) => {
      return done(null, false, { message: "Erro ao buscar usuário!" });
    });
});
