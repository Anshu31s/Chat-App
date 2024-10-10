const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  let users = {};

  const OnlineUsers = () => Object.keys(users);

  const broadcastOnlineUsers = () => {
    io.emit("onlineUsers", OnlineUsers());
  };

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("Join", ({ userId }) => {
      users[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      broadcastOnlineUsers();
    });

    socket.on(
      "privateMessage",
      ({ senderId, senderImage, receiverId, message, time }) => {
        const receiverSocketId = users[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("privateMessage", {
            senderId,
            senderImage,
            message,
            time,
            type: "incoming",
          });
        } else {
          io.to(users[senderId]).emit("privateMessage", {
            senderId: "system",
            message: "User is offline or not found.",
            type: "system",
          });
        }
      }
    );
    
    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        broadcastOnlineUsers();
      }
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});