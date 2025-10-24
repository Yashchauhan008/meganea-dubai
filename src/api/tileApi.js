import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/tiles';

const api = axios.create({ baseURL: API_URL } );

const getToken = () => localStorage.getItem('token');

// --- Existing Functions ---
export const getAllTiles = (params) => api.get('/', { params });
export const getTileById = (id) => api.get(`/${id}`);
export const createTile = (tileData) => api.post('/', tileData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const updateTile = (id, tileData) => api.put(`/${id}`, tileData, { headers: { Authorization: `Bearer ${getToken()}` } });
export const deleteTile = (id) => api.delete(`/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });

// --- New Functions for Archived Tiles ---
export const getArchivedTiles = () => api.get('/archived', { headers: { Authorization: `Bearer ${getToken()}` } });
export const permanentlyDeleteTile = (id) => api.delete(`/archived/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
export const restoreTile = (id) => api.patch(`/restore/${id}`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });

// --- Upload Function (Separate Endpoint) ---
export const uploadTileImage = (formData) => {
  return axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5500/api'}/uploads`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken( )}`,
    },
  });
};
