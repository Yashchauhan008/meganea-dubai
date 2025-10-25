// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// } );

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // --- Salesman API Calls ---
// export const getAllSalesmen = () => api.get('/users/salesmen');
// export const createSalesman = (salesmanData) => api.post('/users/salesmen', salesmanData);
// export const updateSalesman = (id, salesmanData) => api.put(`/users/salesmen/${id}`, salesmanData);
// export const deleteSalesman = (id) => api.delete(`/users/salesmen/${id}`);
// export const getUserById = (id) => api.get(`/users/${id}`); // Re-use general route for fetching details

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/users';
const api = axios.create({ baseURL: API_URL } );
const getToken = () => localStorage.getItem('token');

export const getAllSalesmen = (params) => api.get('/salesmen', {
  headers: { Authorization: `Bearer ${getToken()}` },
  params,
});

export const getUserById = (id) => api.get(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
export const createSalesman = (salesmanData) => api.post('/salesman', salesmanData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const updateSalesman = (id, salesmanData) => api.put(`/salesman/${id}`, salesmanData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const deleteSalesman = (id) => api.delete(`/salesman/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });

// --- NEW API FUNCTION ---
export const getSalesmanParties = (salesmanId) => api.get(`/salesman/${salesmanId}/parties`, {
  headers: { Authorization: `Bearer ${getToken()}` },
});
// ------------------------
