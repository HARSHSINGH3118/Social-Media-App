// socket.js
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

    //
    // ─── PRESENCE & ROOMS ─────────────────────────────────────────────────────────
    //

    socket.on("join", (userId) => {
      if (!userId) return;
      const cleanedId = String(userId).trim();
      socket.userId = cleanedId;
      socket.join(cleanedId);
      onlineUsers.set(cleanedId, socket.id);

      console.log(`✅ User "${cleanedId}" joined room`);
      io.emit("user_online", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user_online", Array.from(onlineUsers.keys()));
        console.log(`❌ User "${socket.userId}" disconnected`);
      } else {
        console.log("❌ Unknown socket disconnected:", socket.id);
      }
    });

    //
    // ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
    //

    socket.on("typing", ({ to }) => {
      if (to) io.to(to).emit("typing", { from: socket.userId });
    });

    socket.on("stop_typing", ({ to }) => {
      if (to) io.to(to).emit("stop_typing", { from: socket.userId });
    });

    //
    // ─── MESSAGING ────────────────────────────────────────────────────────────────
    //

    socket.on("send_message", async (data) => {
      try {
        if (typeof data === "string") data = JSON.parse(data);
        console.log("📩 Raw data in send_message:", data);

        const sender_id = socket.userId?.trim();
        const receiver_id = data.receiver_id;
        const content = data.content;

        if (!sender_id || !receiver_id || !content) {
          console.warn("⚠️ Missing message fields:", {
            sender_id,
            receiver_id,
            content,
          });
          return;
        }

        const message = await sendMessage(sender_id, receiver_id, content);

        // send to receiver
        io.to(receiver_id).emit("receive_message", {
          sender_id,
          content,
          timestamp: message.created_at,
        });

        // ack back to sender
        socket.emit("message_sent", message);
      } catch (err) {
        console.error("🚨 send_message error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    //
    // ─── VIDEO CALL SIGNALING ────────────────────────────────────────────────────
    //

    // Caller → server: initiate call with SDP offer
    socket.on("call_user", ({ to, offer }) => {
      if (to && offer) {
        console.log(`📞 call_user from ${socket.userId} to ${to}`);
        io.to(to).emit("incoming_call", {
          from: socket.userId,
          offer,
        });
      }
    });

    // Callee → server: answer call with SDP answer
    socket.on("answer_call", ({ to, answer }) => {
      if (to && answer) {
        console.log(`✅ answer_call from ${socket.userId} to ${to}`);
        io.to(to).emit("call_accepted", {
          from: socket.userId,
          answer,
        });
      }
    });

    // Both peers exchange ICE candidates
    socket.on("ice_candidate", ({ to, candidate }) => {
      if (to && candidate) {
        // console.log(`🌐 ice_candidate from ${socket.userId} to ${to}`);
        io.to(to).emit("ice_candidate", {
          from: socket.userId,
          candidate,
        });
      }
    });

    // End call
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
