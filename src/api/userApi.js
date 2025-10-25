
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/users';
// const api = axios.create({ baseURL: API_URL } );
// const getToken = () => localStorage.getItem('token');

// export const getAllSalesmen = (params) => api.get('/salesmen', {
//   headers: { Authorization: `Bearer ${getToken()}` },
//   params,
// });

// export const getUserById = (id) => api.get(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const createSalesman = (salesmanData) => api.post('/salesman', salesmanData, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const updateSalesman = (id, salesmanData) => api.put(`/salesman/${id}`, salesmanData, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const deleteSalesman = (id) => api.delete(`/salesman/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });

// // --- NEW API FUNCTION ---
// export const getSalesmanCompanies = (salesmanId) => api.get(`/salesman/${salesmanId}/companies`, {
//   headers: { Authorization: `Bearer ${getToken()}` },
// });
// // ------------------------


import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE

// The URLs are now relative to the base /api path
export const getAllSalesmen = (params) => api.get('/users/salesmen', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createSalesman = (salesmanData) => api.post('/users/salesman', salesmanData);
export const updateSalesman = (id, salesmanData) => api.put(`/users/salesman/${id}`, salesmanData);
export const deleteSalesman = (id) => api.delete(`/users/salesman/${id}`);
export const getSalesmanCompanies = (salesmanId) => api.get(`/users/salesman/${salesmanId}/companies`);
