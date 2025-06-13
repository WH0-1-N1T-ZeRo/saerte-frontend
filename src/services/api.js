// src/services/api.js (atau src/api/index.js)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ganti dengan URL dasar API backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan Bearer Token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error response (misalnya, token expired)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kadaluarsa, arahkan user ke halaman login
      localStorage.removeItem('authToken');
      // Anda bisa menggunakan Vue Router untuk mengarahkan:
      // import router from '@/router';
      // router.push('/login');
      console.warn('Token kadaluarsa atau tidak valid. Mengarahkan ke halaman login...');
    }
    return Promise.reject(error);
  }
);

export default api;