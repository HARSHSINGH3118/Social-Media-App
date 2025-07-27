// src/services/notificationAPI.js
import api from "./api";

export const getNotifications = () => api.get("/api/notifications"); // ✅ FIXED
export const markNotificationsRead = () => api.put("/api/notifications/read");
