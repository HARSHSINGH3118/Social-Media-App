const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

// Load environment variables
dotenv.config();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const tagRoutes = require("./routes/tagRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Import socket initializer
const { initSocket } = require("./socket");

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Real-time WebSocket Initialization
initSocket(server);

const passport = require("passport");
require("./config/passport");

const authRoutes = require("./routes/authRoutes");

app.use(passport.initialize());
app.use("/auth", authRoutes); // after passport init

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

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
