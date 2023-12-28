const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.getLoginForm);
router.post("/login", authController.postLoginForm);
router.get("/signup", authController.getSignupForm);
router.post("/signup", authController.postSignupForm);
router.get("/recovery", authController.getRecoveryForm);
router.post("/recovery", authController.postRecoveryForm);
router.post("/code", authController.postCode);
router.get("/logout", authController.logout);

module.exports = router;
