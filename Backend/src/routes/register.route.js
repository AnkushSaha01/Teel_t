const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("profile"), registerController.registerController);





module.exports = router