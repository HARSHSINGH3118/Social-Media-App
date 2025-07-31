const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const passport = require("passport");

// Load environment variables
dotenv.config();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const tagRoutes = require("./routes/tagRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");

// Import socket initializer
const { initSocket } = require("./socket");

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration — MUST BE FIRST
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"], // 🔥 CRITICAL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Express Middleware
app.use(express.json());

// ✅ Optional: Log all headers to verify Authorization
app.use((req, res, next) => {
  console.log("🛰️ Incoming Request:", req.method, req.url);
  console.log("🧾 Headers received:", req.headers); // 🔥 You'll see if Authorization is missing
  next();
});

// ✅ Passport Init
app.use(passport.initialize());
require("./config/passport");

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// ✅ WebSocket Setup
initSocket(server);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
