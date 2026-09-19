import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Attach the token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Handle expired / missing token
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      
      const currentPath = window.location.pathname;
      const requestUrl = error.config?.url || "";
      const isAuthPath = currentPath === "/login" || currentPath === "/register";
      const isAuthEndpoint = requestUrl.includes("/login/") || requestUrl.includes("/register/");

      if (!isAuthPath && !isAuthEndpoint) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default client;
