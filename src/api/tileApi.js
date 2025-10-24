import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
} );

// Add a request interceptor to include the token in every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// --- TILE API FUNCTIONS ---

export const getAllTiles = () => api.get('/tiles');
export const getTileById = (id) => api.get(`/tiles/${id}`);
export const createTile = (tileData) => api.post('/tiles', tileData);
export const updateTile = (id, tileData) => api.put(`/tiles/${id}`, tileData);

// --- CORRECTED DELETE FUNCTION ---
// It now correctly sends a DELETE request to /tiles/:id
export const deleteTile = (id) => api.delete(`/tiles/${id}`);
// -------------------------------

// --- UPLOAD API FUNCTION ---
export const uploadTileImage = (formData) => {
  return api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
