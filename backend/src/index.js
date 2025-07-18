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

// ✅ CORRECT CORS CONFIGURATION
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(passport.initialize());
require("./config/passport");

// ✅ Debug Logger
app.use((req, res, next) => {
  console.log(
    "🛰️  Incoming:",
    req.method,
    req.url,
    "| From:",
    req.headers.referer || "direct"
  );
  next();
});

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/auth", authRoutes);

// ✅ Real-time WebSocket Initialization
initSocket(server);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
