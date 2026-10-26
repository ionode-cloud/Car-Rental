import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: rawBaseURL.replace(/\/+$/, ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ridevista_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error message extraction and 401 token cleanup
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If token has expired or is unauthorized, clear local token to maintain clean client state
    if (error.response?.status === 401) {
      localStorage.removeItem('ridevista_token');
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
