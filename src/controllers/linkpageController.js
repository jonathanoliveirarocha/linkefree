const userService = require("../services/user.service");
const linkpageService = require("../services/linkpage.service");
const uuid = require("uuid");

const linkpageController = {
  getCreateForm: async (req, res) => {
    try {
      const user = await userService.findById(req.user);
      if (!user) {
        req.flash("error_msg", "Usuário não encontrado!");
        return res.redirect("/userpage");
      }
      const context = {
        title: "Criar",
        loggedUser: user.username,
      };
      res.render("linkpage/addlinkpage", context);
    } catch {
      req.flash("error_msg", "Houve um erro interno!");
      return res.redirect("/userpage");
    }
  },

  postCreateForm: async (req, res) => {
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
    let err = true;
    let link = uuid.v4().substring(0, 6);

    while (err) {
      let existingPage = await linkpageService.findByLink(link);
      if (existingPage) {
        link = uuid.v4().substring(0, 6);
      } else {
        err = false;
      }
    }

    await linkpageService.createLinkpage({
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
      user: req.user,
      link: link,
    });

    req.flash("success_msg", "Criado com sucesso!");
    res.redirect("/userpage");
  },

  getPage: async (req, res) => {
    const page = await linkpageService.findByLink(req.params.page);
    if (!page) {
      req.flash("error_msg", "Página não encontrada!");
      return res.redirect("/");
    }

    const username = await userService.findById(page.user);

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
  },

  getEditPageForm: async (req, res) => {
    const page = await linkpageService.findByUser(req.user);
    if (!page || page.link !== req.params.page) {
      req.flash("error_msg", "Página não encontrada!");
      return res.redirect("/userpage");
    }
    const username = await userService.findById(page.user);

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
  },

  postEditPageForm: async (req, res) => {
    const page = await linkpageService.findByUser(req.user);
    if (!page || page.link !== req.params.page) {
      req.flash("error_msg", "Página não encontrada!");
      return res.redirect("/userpage");
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

    await linkpageService.updateOne(req.user, {
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
    });

    req.flash("success_msg", "Editado com sucesso!");
    res.redirect("/userpage");
  },

  removePage: async (req, res) => {
    const page = await linkpageService.findByUser(req.user);
    if (!page || page.link !== req.params.page) {
      return res.status(400).json({ message: "Página não encontrada!" });
    }

    await linkpageService.deleteOne(req.user);

    req.flash("success_msg", "Excluído com sucesso!");
    res.redirect("/userpage");
  },
};

module.exports = linkpageController;
