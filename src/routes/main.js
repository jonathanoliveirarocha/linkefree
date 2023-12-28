const express = require("express");
const router = express.Router();
const { loggedIn } = require("../helpers/loggedIn");
const mainController = require("../controllers/mainController");

router.get("/", mainController.getHomepage);
router.get("/userpage", loggedIn, mainController.getUserpage);

module.exports = router;
