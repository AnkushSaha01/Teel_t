const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googleAuthCallback } = require("../controllers/OAuth.controller.js");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "https://teel-app.vercel.app/login" }), googleAuthCallback);

module.exports = router;