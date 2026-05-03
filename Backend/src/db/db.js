const mongoose = require("mongoose");
const config = require("../config/config");

async function connectDB(){
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error", error);
    }
}

module.exports = connectDB;


