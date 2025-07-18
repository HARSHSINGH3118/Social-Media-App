// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // no trailing slash
  withCredentials: true, // keep if using cookies
});

// Optional: Add auth token if needed
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export default api;
