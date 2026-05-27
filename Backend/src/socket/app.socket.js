const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const config = require("../config/config");
const chatModel = require("../models/chat.model");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookieString = socket.handshake.headers.cookie;
    if(!cookieString){
      console.log("No cookie found");
      return next(new Error("Authentication error"));
    }
    if (cookieString) {
      const parsedCookies = cookie.parse(cookieString);

      const token = parsedCookies.token;
      if (token) {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
          if (err) {
            return next(new Error("Authentication error"));
          }
          socket.user = decoded;
          console.log(decoded);
          next();
        });
      }
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.join(socket.user.id);

    socket.on("send_message", async (data) => {
      const { message, receiver } = data;
      io.to(receiver).emit("receive_message", {
        message,
        sender: socket.user.id,
        receiver,
      });
      await chatModel.create({
        message,
        sender: socket.user.id,
        receiver,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
