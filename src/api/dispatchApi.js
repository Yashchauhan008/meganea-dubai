// import api from './api'; // Assuming you have the central 'api.js' instance

// // @desc    Create a new dispatch order
// export const createDispatchOrder = (dispatchData) => {
//   return api.post('/dispatches', dispatchData);
// };

// // @desc    Get all dispatch orders
// export const getAllDispatchOrders = () => {
//   return api.get('/dispatches');
// };

// // @desc    Get a single dispatch order by its ID
// export const getDispatchOrderById = (id) => {
//   return api.get(`/dispatches/${id}`);
// };

//   // @desc    Delete a dispatch order
//   export const deleteDispatchOrder = (id) => {
//     return api.delete(`/dispatches/${id}`);
//   };

//   export const updateDispatchOrder = (id, dispatchData) => {
//     return api.put(`/dispatches/${id}`, dispatchData);
//   };

import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE

export const createDispatchOrder = (dispatchData) => api.post('/dispatches', dispatchData);
export const getAllDispatchOrders = () => api.get('/dispatches');
export const getDispatchOrderById = (id) => api.get(`/dispatches/${id}`);
export const deleteDispatchOrder = (id) => api.delete(`/dispatches/${id}`);
export const updateDispatchOrder = (id, dispatchData) => api.put(`/dispatches/${id}`, dispatchData);
