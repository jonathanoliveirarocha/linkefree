const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
require("../models/LinkPage");
const User = mongoose.model("User");
const LinkPage = mongoose.model("LinkPage");
const uuid = require("uuid");
const { loggedIn } = require("../helpers/loggedIn");

router.get("/create", loggedIn, async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado!" });
  }
  const context = {
    title: "Criar",
    loggedUser: user.username,
  };
  res.render("linkpage/addlinkpage", context);
});

router.post("/create", loggedIn, async (req, res) => {
  const {
    instagram,
    youtube,
    whatsapp,
    facebook,
    tiktok,
    linkedin,
    twitter,
    vsco,
    kwai,
    pinterest,
    site,
  } = req.body;
  const newPage = new LinkPage({
    instagram,
    youtube,
    whatsapp,
    facebook,
    tiktok,
    linkedin,
    twitter,
    vsco,
    kwai,
    pinterest,
    site,
  });
  newPage.user = req.user;

  let err = true;
  let link = uuid.v4().substring(0, 6);

  while (err) {
    let existingPage = await LinkPage.findOne({ link });
    if (existingPage) {
      link = uuid.v4().substring(0, 6);
    } else {
      err = false;
      newPage.link = link;
    }
  }
  newPage.save();

  req.flash("success_msg", "Criado com sucesso!");
  res.redirect("/userpage");
});

router.get("/link/:page", async (req, res) => {
  const page = await LinkPage.findOne({ link: req.params.page });
  if (!page) {
    return res.status(400).json({ message: "Página não encontrada!" });
  }
  const username = await User.findOne({ id: page.User });

  const context = {
    instagram: page.instagram,
    youtube: page.youtube,
    whatsapp: page.whatsapp,
    facebook: page.facebook,
    tiktok: page.tiktok,
    linkedin: page.linkedin,
    twitter: page.twitter,
    vsco: page.vsco,
    kwai: page.kwai,
    pinterest: page.pinterest,
    site: page.site,
    username: username.username,
    title: username.username,
    linkpage: true,
  };
  res.render("linkpage/linkpage", context);
});

router.get("/edit/:page", loggedIn, async (req, res) => {
  const page = await LinkPage.findOne({ user: req.user });
  if (!page || page.link !== req.params.page) {
    return res.status(400).json({ message: "Página não encontrada!" });
  }
  const username = await User.findOne({ id: page.User });

  const context = {
    instagram: page.instagram,
    youtube: page.youtube,
    whatsapp: page.whatsapp,
    facebook: page.facebook,
    tiktok: page.tiktok,
    linkedin: page.linkedin,
    twitter: page.twitter,
    vsco: page.vsco,
    kwai: page.kwai,
    pinterest: page.pinterest,
    site: page.site,
    loggedUser: username.username,
    title: "Edição",
  };
  res.render("linkpage/editlinkpage", context);
});

router.post("/edit/:page", loggedIn, async (req, res) => {
  const page = await LinkPage.findOne({ user: req.user });
  if (!page || page.link !== req.params.page) {
    return res.status(400).json({ message: "Página não encontrada!" });
  }
  const {
    instagram,
    youtube,
    whatsapp,
    facebook,
    tiktok,
    linkedin,
    twitter,
    vsco,
    kwai,
    pinterest,
    site,
  } = req.body;

  await LinkPage.updateOne(
    { user: req.user },
    {
      instagram: instagram,
      youtube: youtube,
      whatsapp: whatsapp,
      facebook: facebook,
      tiktok: tiktok,
      linkedin: linkedin,
      twitter: twitter,
      vsco: vsco,
      kwai: kwai,
      pinterest: pinterest,
      site: site,
    }
  );
  req.flash("success_msg", "Editado com sucesso!");
  res.redirect("/userpage");
});

router.get("/remove/:page", loggedIn, async (req, res) => {
  const page = await LinkPage.findOne({ user: req.user });
  if (!page || page.link !== req.params.page) {
    return res.status(400).json({ message: "Página não encontrada!" });
  }

  await LinkPage.deleteOne({ user: req.user });

  req.flash("success_msg", "Excluído com sucesso!");
  res.redirect("/userpage");
});

module.exports = router;
