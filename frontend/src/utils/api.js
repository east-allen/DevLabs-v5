import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.com/api'
  : 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CSRF cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// CSRF token management
let csrfToken = null;

// Function to get CSRF token
export const getCsrfToken = async () => {
  if (!csrfToken) {
    try {
      const response = await api.get('/csrf/restore');
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
  return csrfToken;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token to non-GET requests
    if (config.method !== 'get') {
      const token = await getCsrfToken();
      if (token) {
        config.headers['X-CSRF-Token'] = token;
      }
    }

    // Add auth token if available
    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If CSRF token is invalid, refresh it and retry
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null; // Reset token
      const newToken = await getCsrfToken();
      if (newToken) {
        error.config.headers['X-CSRF-Token'] = newToken;
        return api.request(error.config); // Retry request
      }
    }

    // Handle 401 unauthorized - clear auth data
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/session', credentials),
  register: (userData) => api.post('/users', userData),
  logout: () => api.delete('/session'),
  getCurrentUser: () => api.get('/session'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

export const spotsAPI = {
  getAll: (params) => api.get('/spots', { params }),
  getById: (id) => api.get(`/spots/${id}`),
  create: (spotData) => api.post('/spots', spotData),
  update: (id, spotData) => api.put(`/spots/${id}`, spotData),
  delete: (id) => api.delete(`/spots/${id}`),
  getReviews: (id) => api.get(`/spots/${id}/reviews`),
  createReview: (id, reviewData) => api.post(`/spots/${id}/reviews`, reviewData),
  getBookings: (id) => api.get(`/spots/${id}/bookings`),
  createBooking: (id, bookingData) => api.post(`/spots/${id}/bookings`, bookingData),
};

export const bookingsAPI = {
  getUserBookings: () => api.get('/bookings/current'),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const reviewsAPI = {
  getById: (id) => api.get(`/reviews/${id}`),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  addImage: (id, imageData) => api.post(`/reviews/${id}/images`, imageData),
};

export const imagesAPI = {
  delete: (id) => api.delete(`/spot-images/${id}`),
};

// Initialize CSRF token on app start
export const initializeAPI = async () => {
  await getCsrfToken();
};

export default api;