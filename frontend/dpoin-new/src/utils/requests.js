// src/utils/requests.js
import axios from "axios";

// Buat instance axios dengan konfigurasi dasar
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, // timeout 10 detik, bisa disesuaikan
  headers: {
    "Content-Type": "application/json",
    // bisa ditambah header lain seperti Authorization kalau perlu
  },
});

// Contoh interceptor request, misal untuk tambah token otentikasi
instance.interceptors.request.use(
  (config) => {
    // Contoh: ambil token dari localStorage, atau context auth
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Contoh interceptor response, untuk handle error global
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bisa tambahkan handle error otomatis, misal logout kalau token expired
    if (error.response && error.response.status === 401) {
      // logout user, redirect ke login, dll
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
