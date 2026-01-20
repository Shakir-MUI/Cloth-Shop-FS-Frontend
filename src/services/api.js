import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: (refreshToken) => api.post('/accounts/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.put('/accounts/profile/update/', data),
  changePassword: (data) => api.post('/accounts/change-password/', data),
};

// Products APIs
export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/update/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/delete/${id}/`),
  getAdminProducts: () => api.get('/products/admin/all/'),
  getStats: () => api.get('/products/admin/stats/'),
};

// Categories APIs
export const categoriesAPI = {
  getAll: () => api.get('/products/categories/'),
};

// Reviews APIs
export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/products/${productId}/reviews/`),
  createReview: (productId, data) => api.post(`/products/${productId}/reviews/create/`, data),
  deleteReview: (reviewId) => api.delete(`/products/reviews/${reviewId}/delete/`),
};

// Favorites APIs
export const favoritesAPI = {
  getAll: () => api.get('/products/favorites/'),
  add: (productId) => api.post(`/products/favorites/${productId}/add/`),
  remove: (productId) => api.delete(`/products/favorites/${productId}/remove/`),
  check: (productId) => api.get(`/products/favorites/${productId}/check/`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (data) => api.post('/orders/cart/add/', data),
  updateCart: (cartId, data) => api.put(`/orders/cart/${cartId}/update/`, data),
  removeFromCart: (cartId) => api.delete(`/orders/cart/${cartId}/remove/`),
  clearCart: () => api.delete('/orders/cart/clear/'),
};


// Orders APIs
export const ordersAPI = {
  getAll: () => api.get('/orders/'),
  getById: (orderId) => api.get(`/orders/${orderId}/`),
  create: (data) => api.post('/orders/create/', data),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel/`),
  getAdminOrders: () => api.get('/orders/admin/all/'),
  updateStatus: (orderId, data) => api.put(`/orders/admin/${orderId}/update/`, data),
};

export default api;