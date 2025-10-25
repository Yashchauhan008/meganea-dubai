// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/companies';
// const api = axios.create({ baseURL: API_URL } );
// const getToken = () => localStorage.getItem('token');

// // Pass query parameters for searching and filtering
// export const getAllCompanies = (params) => api.get('/', {
//   headers: { Authorization: `Bearer ${getToken()}` },
//   params,
// });

// export const getCompanyById = (id) => api.get(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const createCompany = (companyData) => api.post('/', companyData, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const updateCompany = (id, companyData) => api.put(`/${id}`, companyData, { headers: { Authorization: `Bearer ${getToken()}` } });
// export const deleteCompany = (id) => api.delete(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });

import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE

// The URL is now '/companies' because the base is set in api.js
export const getAllCompanies = (params) => api.get('/companies', { params });
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const createCompany = (companyData) => api.post('/companies', companyData);
export const updateCompany = (id, companyData) => api.put(`/companies/${id}`, companyData);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
