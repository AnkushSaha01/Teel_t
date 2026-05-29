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
const picklistRouter = require("./routes/picklist.route");
require("./config/passport")(passport);

app.use(passport.initialize());

app.use(cors({
  origin: config.CLIENT_URL, // e.g. "https://teel-app.vercel.app"
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
app.use("/api/picklist", picklistRouter);

// Health check / welcome message for the API root
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Teel API Server is running successfully!",
    status: "healthy",
    timestamp: new Date()
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = app;
