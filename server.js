// STEP 1: Import required modules
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// STEP 2: Initialize the Next.js app
const port = parseInt(process.env.PORT || "8000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// STEP 3: Prepare Next.js, then start server
app.prepare().then(() => {
  // STEP 4: Create HTTP server to handle both Next.js and WebSocket requests
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // STEP 5: Attach Socket.IO to the HTTP server
  const io = new Server(server);

  // STEP 6: Use a Map to track online users: userId -> socket.id
  const users = new Map();

  // STEP 7: Helper to get list of online user IDs
  const getOnlineUsers = () => [...users.keys()];

  // STEP 8: Helper to notify all clients about online users
  const broadcastOnlineUsers = () => {
    io.emit("onlineUsers", getOnlineUsers());
  };

  // STEP 9: Handle new socket connections
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // STEP 10: Handle user joining (client sends 'Join' event)
    socket.on("Join", ({ userId }) => {
      if (!userId) {
        socket.emit("error", { message: "userId is required" });
        return;
      }
      users.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ID: ${socket.id}`);
      broadcastOnlineUsers();
    });

    // STEP 11: Handle private messaging
    socket.on(
      "privateMessage",
      async ({ senderId, receiverId, message, messageType, time }) => {
        try {
          // Store message in the DB
          await prisma.message.create({
            data: {
              senderId,
              receiverId,
              message,
              messageType,
              time,
            },
          });

          // Send to receiver if online
          const receiverSocketId = users.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("privateMessage", {
              senderId,
              message,
              messageType,
              time,
              type: "incoming",
            });
          }
        } catch (error) {
          console.error("Failed to save message:", error);
          socket.emit("error", { message: "Message could not be saved." });
        }
      }
    );
    // STEP 11.1: Handle typing events
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId, isTyping });
      }
    });

    // STEP 12: Handle user disconnection
    socket.on("disconnect", async () => {
      try {
        // Find the userId that matches the disconnected socket ID
        const userId = [...users.entries()].find(
          ([_, id]) => id === socket.id
        )?.[0];

        if (userId) {
          // Update user status in the database
          await prisma.user.update({
            where: { id: userId },
            data: {
              lastOnline: new Date(),
            },
          });

          users.delete(userId); // Remove user from online list
          console.log(`User ${userId} disconnected`);

          // Broadcast updated online users list
          broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  // STEP 13: Start the server on port 3000
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
