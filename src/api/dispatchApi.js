import api from './api'; // Assuming you have the central 'api.js' instance

// @desc    Create a new dispatch order
export const createDispatchOrder = (dispatchData) => {
  return api.post('/dispatches', dispatchData);
};

// @desc    Get all dispatch orders
export const getAllDispatchOrders = () => {
  return api.get('/dispatches');
};

// @desc    Get a single dispatch order by its ID
export const getDispatchOrderById = (id) => {
  return api.get(`/dispatches/${id}`);
};


export const updateDispatchOrder = (id, dispatchData) => {
    return api.put(`/dispatches/${id}`, dispatchData);
  };
  
  // @desc    Delete a dispatch order
  export const deleteDispatchOrder = (id) => {
    return api.delete(`/dispatches/${id}`);
  };