const express = require("express");
const router = express.Router();
const { loginController, logoutController, refreshController } = require("../controllers/loginController");

router.post("/login", loginController)
router.post("/logout", logoutController)
router.post("/refresh", refreshController)

module.exports = router 
