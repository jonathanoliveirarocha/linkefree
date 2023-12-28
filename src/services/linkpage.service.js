const LinkPage = require("../models/LinkPage");

const linkpageService = {
  createLinkpage: async (linkpage) => {
    const newPage = await LinkPage(linkpage);
    newPage.save();
  },

  findByLink: async (link) => {
    let existingPage = await LinkPage.findOne({ link });
    if (existingPage) {
      return existingPage;
    } else {
      return null;
    }
  },

  findByUser: async (id) => {
    const page = await LinkPage.findOne({ user: id });
    if (page) {
      return page;
    } else {
      return null;
    }
  },

  updateOne: async (id, links) => {
    await LinkPage.updateOne({ user: id }, links);
  },

  deleteOne: async (id) => {
    await LinkPage.deleteOne({ user: id });
  },
};

module.exports = linkpageService;
