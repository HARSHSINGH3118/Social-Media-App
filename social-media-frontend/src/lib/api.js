import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // force set
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`, // ✅ force attach
      };
    }
  } catch (err) {
    console.error("Interceptor Error:", err);
  }
  return config;
});

export default api;
