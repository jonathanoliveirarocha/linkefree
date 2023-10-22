const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
require("dotenv").config();

const userEmail = process.env.USER_EMAIL || "<E-MAIL>";
const userPassword = process.env.USER_PASSWORD || "<PASSWORD>";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: userEmail,
    pass: userPassword,
  },
});

router.get("/login", (req, res) => {
  const context = {
    title: "Login",
  };
  res.render("auth/login", context);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/userpage",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/signup", (req, res) => {
  const context = {
    title: "Cadastro",
  };
  res.render("auth/signup", context);
});

router.post("/signup", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  const existingUser = await User.findOne({ email });
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
    res.redirect("/signup");
  } else {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email, password });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            req.flash("error_msg", "Erro ao cadastrar usuário!");
            res.redirect("/signup");
          } else {
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.login(newUser, (err) => {
                  if (err) {
                    req.flash("error_msg", "Erro ao autenticar usuário!");
                    res.redirect("/login");
                  }
                  res.redirect("/userpage");
                });
              })
              .catch((err) => {
                req.flash("error_msg", "Erro ao cadastrar usuário!");
                res.redirect("/signup");
              });
          }
        });
      });
    } catch (err) {
      req.flash("error_msg", "Erro ao cadastrar usuário!");
      res.redirect("/signup");
    }
  }
});

router.get("/recovery", (req, res) => {
  const context = {
    title: "Recuperação de Conta",
  };
  res.render("auth/recovery", context);
});

router.post("/recovery", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "E-mail não encontrado." });
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
});

router.post("/code", async (req, res) => {
  try {
    const { token, email, password, password2 } = req.body;

    const user = await User.findOne({
      email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

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
});

module.exports = router;
