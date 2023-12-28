const userService = require("../services/user.service");
const linkpageService = require("../services/linkpage.service");

const mainController = {
  getHomepage: (req, res) => {
    const context = {
      title: "Home",
    };
    res.render("home", context);
  },

  getUserpage: async (req, res) => {
    const user = await userService.findById(req.user);
    const page = await linkpageService.findByUser(req.user);
    let pagelink = "";
    if (page) {
      pagelink = page.link;
    }
    const context = {
      title: "Página do Usuário",
      loggedUser: user.username,
      pagelink: pagelink,
    };
    res.render("auth/userpage", context);
  },
};
module.exports = mainController;
