// backend/src/socket.js

const { Server } = require("socket.io");
const { sendMessage } = require("./models/messageModel");
const { getUserById } = require("./models/userModel");
const { createNotification } = require("./models/notificationModel");

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("📡 User connected:", socket.id);

    // ─── JOIN ROOM ───────────────────────────────
    socket.on("join", (userId) => {
      if (!userId) return;
      const cleanedId = String(userId).trim();
      socket.userId = cleanedId;
      socket.join(cleanedId);
      onlineUsers.set(cleanedId, socket.id);
      console.log(`✅ User "${cleanedId}" joined room`);
      io.emit("user_online", Array.from(onlineUsers.keys()));
    });

    // ─── DISCONNECT ─────────────────────────────
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user_online", Array.from(onlineUsers.keys()));
        console.log(`❌ User "${socket.userId}" disconnected`);
      } else {
        console.log("❌ Unknown socket disconnected:", socket.id);
      }
    });

    // ─── TYPING INDICATOR ────────────────────────
    socket.on("typing", ({ to }) => {
      if (to) io.to(to).emit("typing", { from: socket.userId });
    });

    socket.on("stop_typing", ({ to }) => {
      if (to) io.to(to).emit("stop_typing", { from: socket.userId });
    });

    // ─── MESSAGING ───────────────────────────────
    socket.on("send_message", async (data) => {
      try {
        if (typeof data === "string") data = JSON.parse(data);

        const sender_id = socket.userId?.trim();
        const receiver_id = data.receiver_id;
        const content = typeof data.content === "string" ? data.content : "";

        if (!sender_id || !receiver_id || !content || content === "null") {
          console.warn("⚠️ Invalid message data:", {
            sender_id,
            receiver_id,
            content,
          });
          return;
        }

        console.log("✉️ Emitting message with content:", content);

        const message = await sendMessage(sender_id, receiver_id, content);

        io.to(receiver_id).emit("receive_message", {
          sender_id,
          content,
          timestamp: message.created_at,
        });

        const notif = await createNotification({
          user_id: receiver_id,
          sender_id,
          post_id: null,
          type: "message",
          message: content,
        });

        console.log("🔔 Notification created:", notif);

        io.to(receiver_id).emit("notification", notif);
        socket.emit("message_sent", message);
      } catch (err) {
        console.error("🚨 send_message error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ─── WEBRTC: CALLING ────────────────────────
    socket.on("call_user", ({ to, offer, isVoice }) => {
      io.to(to).emit("incoming_call", {
        from: socket.userId,
        offer,
        isVoice,
      });
    });

    socket.on("answer_call", ({ to, answer }) => {
      io.to(to).emit("call_accepted", { answer });
    });

    socket.on("ice_candidate", ({ to, candidate }) => {
      if (to && candidate) {
        io.to(to).emit("ice_candidate", {
          from: socket.userId,
          candidate,
        });
      }
    });

    socket.on("end_call", ({ to }) => {
      if (to) {
        console.log(`✖️ end_call from ${socket.userId} to ${to}`);
        io.to(to).emit("call_ended", { from: socket.userId });
      }
    });
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
