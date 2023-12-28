const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

function initializePassport(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await userService.findByEmail(email);

      if (!user) {
        return done(null, false, { message: "Esta conta não existe!" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Senha incorreta!" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findById(id);

      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "Usuário não encontrado!" });
      }
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initializePassport;
