import axios from 'axios';
import { getToken } from '../hooks/useAuth';

const axiosInstance = axios.create({
  // Reads VITE_API_BASE_URL from .env; falls back to the Spring Boot default port
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT Bearer token to every outgoing request except public auth endpoints.
// Sending a stale token on login/register causes Spring Security to reject
// the request with 401 before it even validates the credentials.
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicAuth =
      config.url?.includes('/api/auth/login') ||
      config.url?.includes('/api/auth/register') ||
      config.url?.includes('/api/auth/forgot-password') ||
      config.url?.includes('/api/auth/verify-otp') ||
      config.url?.includes('/api/auth/reset-password');
    if (!isPublicAuth) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
