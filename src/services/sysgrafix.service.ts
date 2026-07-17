import axios from "axios";

const sysgrafix = axios.create({
  baseURL: "http://192.168.100.24:3000/v1/",
});

sysgrafix.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

sysgrafix.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 em:", error.config?.url, "→ token presente?", !!localStorage.getItem("token"));
    }
    return Promise.reject(error);
  },
);

export default sysgrafix;
