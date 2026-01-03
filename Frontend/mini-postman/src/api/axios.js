import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: This allows cookies to be sent with requests
  withCredentials: true,
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 for auth check endpoint
    if (error.response?.status === 401) {
      // Let the auth slice handle this
      console.log("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default api;