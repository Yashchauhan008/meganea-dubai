import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_BASE_URL,
} );

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Salesman API Calls ---
export const getAllSalesmen = () => api.get('/users/salesmen');
export const createSalesman = (salesmanData) => api.post('/users/salesmen', salesmanData);
export const updateSalesman = (id, salesmanData) => api.put(`/users/salesmen/${id}`, salesmanData);
export const deleteSalesman = (id) => api.delete(`/users/salesmen/${id}`);
export const getUserById = (id) => api.get(`/users/${id}`); // Re-use general route for fetching details
