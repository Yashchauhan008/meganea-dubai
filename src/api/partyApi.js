import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/parties';
const api = axios.create({ baseURL: API_URL } );
const getToken = () => localStorage.getItem('token');

// Pass query parameters for searching and filtering
export const getAllParties = (params) => api.get('/', {
  headers: { Authorization: `Bearer ${getToken()}` },
  params,
});

export const getPartyById = (id) => api.get(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
export const createParty = (partyData) => api.post('/', partyData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const updateParty = (id, partyData) => api.put(`/${id}`, partyData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const deleteParty = (id) => api.delete(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
