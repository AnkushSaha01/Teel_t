const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const config = require("../config/config");
const chatModel = require("../models/chat.model");
const groupModel = require("../models/group.model");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "https://teel-app.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    // 1. Check for token in handshake auth
    let token = socket.handshake.auth?.token;
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // 2. Fallback to cookies (useful for local development or legacy client connections)
    if (!token) {
      const cookieString = socket.handshake.headers.cookie;
      if (cookieString) {
        const parsedCookies = cookie.parse(cookieString);
        token = parsedCookies.token || parsedCookies.refreshToken;
      }
    }

    if (!token) {
      console.log("No token or cookie found for socket authentication");
      return next(new Error("Authentication error: Missing token"));
    }

    // 3. Verify the token (try Access Token Secret first, then Refresh / JWT Secrets)
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        socket.user = decoded;
        return next();
      }

      jwt.verify(token, config.REFRESH_TOKEN_SECRET, (err2, decoded2) => {
        if (!err2) {
          socket.user = decoded2;
          return next();
        }

        jwt.verify(token, config.JWT_SECRET, (err3, decoded3) => {
          if (!err3) {
            socket.user = decoded3;
            return next();
          }
          console.error("Socket Auth verification failed:", err3.message);
          return next(new Error("Authentication error: Invalid token"));
        });
      });
    });
  });

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);
    socket.join(socket.user.id);

    // Join room for each group the user is in
    try {
      const groups = await groupModel.find({ members: socket.user.id });
      groups.forEach((group) => {
        socket.join(group._id.toString());
        console.log(`User ${socket.user.id} joined group room: ${group._id}`);
      });
    } catch (err) {
      console.error("Error joining group rooms:", err);
    }

    socket.on("send_message", async (data) => {
      const { message, receiver, groupId } = data;

      if (groupId) {
        // Fetch group's expiresAt to handle cascade TTL deletion
        const group = await groupModel.findById(groupId).select("expiresAt");

        // Broadcast group message to group room
        io.to(groupId).emit("receive_message", {
          message,
          sender: socket.user.id,
          groupId,
          createdAt: new Date().toISOString(),
        });
        await chatModel.create({
          message,
          sender: socket.user.id,
          groupId,
          expiresAt: group?.expiresAt || undefined,
        });
      } else {
        // Direct message
        io.to(receiver).emit("receive_message", {
          message,
          sender: socket.user.id,
          receiver,
          createdAt: new Date().toISOString(),
        });
        await chatModel.create({
          message,
          sender: socket.user.id,
          receiver,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
