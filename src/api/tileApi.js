// import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE
// import axios from 'axios'; // Keep this for the separate upload function for now

// // --- Existing Functions (now using the central 'api' instance) ---
// export const getAllTiles = (params) => api.get('/tiles', { params });
// export const getTileById = (id) => api.get(`/tiles/${id}`);
// export const createTile = (tileData) => api.post('/tiles', tileData);
// export const updateTile = (id, tileData) => api.put(`/tiles/${id}`, tileData);
// export const deleteTile = (id) => api.delete(`/tiles/${id}`);

// // --- New Functions for Archived Tiles ---
// export const getArchivedTiles = () => api.get('/tiles/archived');
// export const permanentlyDeleteTile = (id) => api.delete(`/tiles/archived/${id}`);
// export const restoreTile = (id) => api.patch(`/tiles/restore/${id}`, {});

// // --- THIS IS THE CRITICAL FIX FOR THE SEARCH ---
// // It now uses the central 'api' instance which has the authentication interceptor.
// export const searchTilesForBooking = (searchTerm) => {
//   return api.get('/tiles/for-booking', {
//     params: { search: searchTerm },
//   });
// };
// // ----------------------------------------------------

// // The upload function uses a different 'Content-Type' and can remain as is.
// export const uploadTileImage = (formData) => {
//   const token = localStorage.getItem('token');
//   return axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5500/api'}/uploads`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   } );
// };


import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE
import axios from 'axios'; // Keep for the separate upload function

// All these now use the central 'api' instance
export const getAllTiles = (params) => api.get('/tiles', { params });
export const getTileById = (id) => api.get(`/tiles/${id}`);
export const createTile = (tileData) => api.post('/tiles', tileData);
export const updateTile = (id, tileData) => api.put(`/tiles/${id}`, tileData);
export const deleteTile = (id) => api.delete(`/tiles/${id}`);
export const searchTilesForBooking = (searchTerm) => {
  return api.get('/tiles/for-booking', { params: { search: searchTerm } });
};

// The upload function can remain as is because it needs a special header.
export const uploadTileImage = (formData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5500/api'}/uploads`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  } );
};


export const bulkCreateTiles = (tiles) => {
  // The payload is an object with a 'tiles' key containing the array
  return api.post('/tiles/bulk', { tiles });
};