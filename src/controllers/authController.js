const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
require("dotenv").config();

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: userEmail,
    pass: userPassword,
  },
});

const authController = {
  getLoginForm: (req, res) => {
    if (req.user) {
      req.flash("success_msg", "Você já está conectado!");
      res.redirect("/userpage");
    }
    const context = {
      title: "Login",
    };
    res.render("auth/login", context);
  },

  postLoginForm: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/userpage",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })(req, res, next);
  },

  getSignupForm: (req, res) => {
    const context = {
      title: "Cadastro",
    };
    res.render("auth/signup", context);
  },

  postSignupForm: async (req, res) => {
    const { username, email, password, password2 } = req.body;
    try {
      const existingUser = await userService.findByEmail(email);
      var error = [];
      if (username == "" || email == "" || password == "" || password2 == "") {
        error.push("Por favor, preencha todos os campos!");
      }
      if (existingUser) {
        error.push("Este E-mail já está sendo utilizado!");
      }
      if (8 > password.length) {
        error.push("A senha deve conter pelo menos 8 caracteres!");
      }
      if (password != password2) {
        error.push("As senhas não conferem!");
      }
      if (error.length > 0) {
        req.flash("error_msg", `${error[0]}`);
        res.redirect("/auth/signup");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userService.createNewUser({
          username,
          email,
          password: hashedPassword,
        });
      }
    } catch {
      req.flash("error_msg", "Erro ao cadastrar usuário!");
      res.redirect("/signup");
    }
  },

  getRecoveryForm: (req, res) => {
    const context = {
      title: "Recuperação de Conta",
    };
    res.render("auth/recovery", context);
  },

  postRecoveryForm: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userService.findByEmail(email);
      if (!user) {
        req.flash("error_msg", "E-mail não encontrado!");
        return res.redirect("/auth/recovery");
      }

      const token = uuid.v4().substring(0, 6);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      const mailOptions = {
        to: email,
        subject: "Linkefree - Recuperação de Senha",
        html: `Seu código: ${token}.`,
      };

      await transporter.sendMail(mailOptions);
      const context = {
        title: "Nova Senha",
        email: email,
      };
      res.render("auth/code", context);
    } catch (error) {
      req.flash("error_msg", "Ocorreu um erro interno!");
      res.redirect("/auth/recovery");
    }
  },

  postCode: async (req, res) => {
    try {
      const { token, email, password, password2 } = req.body;

      const user = await userService.recoveryPassword(email, token);

      let error = [];
      if (token == "" || password == "" || password2 == "") {
        error.push("Por favor, preencha todos os campos!");
      }
      if (!user) {
        error.push("Código inválido ou expirado.");
      }
      if (8 > password.length) {
        error.push("A senha deve conter pelo menos 8 caracteres!");
      }
      if (password != password2) {
        error.push("As senhas não conferem!");
      }
      if (error.length > 0) {
        req.flash("error_msg", `${error[0]}`);
        res.redirect("/auth/recovery");
      } else {
        const hash = await bcrypt.hash(password, 10);

        user.password = hash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();
        req.flash("success_msg", "Senha redefinida com sucesso!");
        res.redirect("/auth/login");
      }
    } catch (error) {
      req.flash("error_msg", "Erro ao redefinir senha!");
      res.redirect("/auth/login");
    }
  },

  logout: (req, res) => {
    req.logout((err) => {
      res.redirect("/");
    });
  },
};

module.exports = authController;
