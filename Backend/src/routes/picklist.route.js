const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")

const { CreatePickList, GetPickList, DeletePickList, UpdatePickList } = require("../controllers/picklist.controller")
const pickListRouter = express.Router()

pickListRouter.post("/create", authMiddleware, CreatePickList)
pickListRouter.get("/get", authMiddleware, GetPickList)
pickListRouter.delete("/delete/:id", authMiddleware, DeletePickList)
pickListRouter.put("/update/:id", authMiddleware, UpdatePickList)

module.exports = pickListRouter