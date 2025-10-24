import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_BASE_URL,
} );

// Add a request interceptor to include the token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Party API Calls ---
export const getAllParties = () => api.get('/parties');
export const getPartyById = (id) => api.get(`/parties/${id}`);
export const createParty = (partyData) => api.post('/parties', partyData);
export const updateParty = (id, partyData) => api.put(`/parties/${id}`, partyData);
export const deleteParty = (id) => api.delete(`/parties/${id}`);

// --- User API Call for Salesmen ---
export const getSalesmen = () => api.get('/users/salesmen');

