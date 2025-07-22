// src/services/api.js
import axios from "axios";

// Only read window.location.hostname when in the browser
const getHost = () =>
  typeof window !== "undefined" ? window.location.hostname : "localhost";

const api = axios.create({
  baseURL: `http://${getHost()}:5000/api`,
  withCredentials: true,
});

// Only attach the interceptor in the browser
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  });
}

export default api;
