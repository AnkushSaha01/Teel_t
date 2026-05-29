const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const config = require("../config/config");
const chatModel = require("../models/chat.model");
const groupModel = require("../models/group.model");

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
