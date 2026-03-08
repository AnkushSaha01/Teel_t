const express = require("express");
const app = express();
// const postModel = require("./models/post.model");
const postRoute = require("./routes/post.route");
const getPostRoute = require("./routes/getPost.route");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/post", postRoute);
app.use('/post', getPostRoute);




module.exports = app;
