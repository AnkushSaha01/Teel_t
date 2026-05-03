const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googleAuthCallback } = require("../controllers/OAuth.controller.js");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }), googleAuthCallback);

module.exports = router;