import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to unwrap { success, data, timestamp }
api.interceptors.response.use(
  (response) => {
    // If the response follows our ApiResponse structure, return the 'data' payload
    if (response.data && typeof response.data === 'object' && response.data.success === true) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
