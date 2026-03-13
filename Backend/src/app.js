const express = require("express");
const app = express();
// const postModel = require("./models/post.model");
const postRoute = require("./routes/post.route");
const getPostRoute = require("./routes/getPost.route");
const registerRoute = require("./routes/register.route");
const loginRoute = require("./routes/login.routes");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/post", postRoute);
app.use('/post', getPostRoute);
app.use("/auth/user", registerRoute);
app.use("/auth/user", loginRoute);




module.exports = app;
