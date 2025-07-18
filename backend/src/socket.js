const { Server } = require("socket.io");
const { sendMessage } = require("./models/messageModel");

let io;
const onlineUsers = new Map(); // 🟢 Track online users

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("📡 User connected:", socket.id);

    // JOIN ROOM
    socket.on("join", (userId) => {
      if (!userId) return;

      const cleanedId = String(userId)
        .replace(/["\n\r]/g, "")
        .trim();
      socket.userId = cleanedId;
      socket.join(cleanedId);
      onlineUsers.set(cleanedId, socket.id); // ✅ track online user

      console.log(`✅ User "${cleanedId}" joined room`);
      io.emit("user_online", Array.from(onlineUsers.keys())); // 🔄 notify all clients
    });

    // TYPING INDICATOR
    socket.on("typing", ({ to }) => {
      if (to) {
        io.to(to).emit("typing", { from: socket.userId });
      }
    });

    socket.on("stop_typing", ({ to }) => {
      if (to) {
        io.to(to).emit("stop_typing", { from: socket.userId });
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        console.log(" Raw data received in send_message:", data);

        const sender_id = socket.userId?.trim();
        const receiver_id = data?.receiver_id;
        const content = data?.content;

        console.log(" Cleaned:", { sender_id, receiver_id, content });

        if (!sender_id || !receiver_id || !content) {
          console.log("⚠️ Missing message data:", {
            sender_id,
            receiver_id,
            content,
          });
          return;
        }

        const message = await sendMessage(sender_id, receiver_id, content);

        io.to(receiver_id).emit("receive_message", {
          sender_id,
          content,
          timestamp: message.created_at,
        });

        socket.emit("message_sent", message);
      } catch (err) {
        console.error(" Socket message error:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user_online", Array.from(onlineUsers.keys()));
        console.log(` User "${socket.userId}" disconnected`);
      } else {
        console.log(" Unknown user disconnected:", socket.id);
      }
    });
  });
};

const getIO = () => io;
module.exports = { initSocket, getIO };
