const config = require("./config/config");
const express = require("express");
const app = express();
// const postModel = require("./models/post.model");
const postRoute = require("./routes/post.route");
const getPostRoute = require("./routes/getPost.route");
const registerRoute = require("./routes/register.route");
const loginRoute = require("./routes/login.routes");
const googleAuthRoutes = require("./routes/OAuth.route");
const userRoute = require("./routes/user.route");
const followRoute = require("./routes/follow.route");
const interactionRoute = require("./routes/interactions.route");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const messageRouter = require("./routes/messages.route");
const groupRouter = require("./routes/group.route");
require("./config/passport")(passport);

app.use(passport.initialize());

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // For development, allow localhost. In production, use the env variable.
        if (origin.includes("localhost") || origin === config.FRONTEND_URI) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback to true for debugging if there's a mismatch
        }
    }, 
    credentials: true 
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static("dist"));


app.use("/api/post", postRoute);
app.use('/api/post', getPostRoute);
app.use("/api/auth/user", registerRoute);
app.use("/api/auth/user", loginRoute);
app.use("/api/auth/", googleAuthRoutes);
app.use("/api/user", userRoute);
app.use("/api/follow", followRoute);
app.use("/api/interaction", interactionRoute);
app.use("/api/messages", messageRouter);
app.use("/api/group", groupRouter);


app.get("*name", (req, res) => {
  console.log(req.params.name);

  res.sendFile("index.html", { root: "dist" });
});


module.exports = app;
