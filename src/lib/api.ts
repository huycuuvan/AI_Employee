import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-domain.com/api", // Thay bằng URL backend thật
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động gắn token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
