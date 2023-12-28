const express = require("express");
const router = express.Router();
const { loggedIn } = require("../helpers/loggedIn");
const linkpageController = require("../controllers/linkpageController");

router.get("/create", loggedIn, linkpageController.getCreateForm);
router.post("/create", loggedIn, linkpageController.postCreateForm);
router.get("/link/:page", linkpageController.getPage);
router.get("/edit/:page", loggedIn, linkpageController.getEditPageForm);
router.post("/edit/:page", loggedIn, linkpageController.postEditPageForm);
router.get("/remove/:page", loggedIn, linkpageController.removePage);

module.exports = router;
