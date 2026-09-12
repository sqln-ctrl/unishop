import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("unishop_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !["/auth/login", "/auth/register"].includes(error.config?.url)) {
    window.dispatchEvent(new Event("unishop:unauthorized"));
  }
  return Promise.reject(error);
});
