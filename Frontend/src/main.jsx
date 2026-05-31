import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/Context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'

import { getAccessToken, setAccessToken } from './context/Context'

const backURI = import.meta.env.VITE_BACKEND_URL || '/api';

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Global Axios interceptor to attach JWT token to all API requests
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Axios interceptor to handle expired access tokens and perform silent refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop if the refresh token request itself fails
    if (originalRequest.url?.includes("/auth/user/refresh")) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      if (error.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Call backend /refresh to rotate refresh token and get a new access token
          const res = await axios.post(`${backURI}/auth/user/refresh`, {}, { withCredentials: true });
          const { accessToken } = res.data;

          // Save new access token globally
          setAccessToken(accessToken);

          // Update headers and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          isRefreshing = false;

          return axios(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // Refresh failed (e.g. refresh token expired or hijacked) -> clear session and redirect to login
          setAccessToken(null);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // Completely unauthorized (e.g. missing token, invalid token) -> redirect to login if not on a public route
        const isPublicRoute = ["/login", "/register", "/"].includes(window.location.pathname);
        if (!isPublicRoute) {
          setAccessToken(null);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </QueryClientProvider>
)
