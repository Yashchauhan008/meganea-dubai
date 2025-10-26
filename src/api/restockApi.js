import api from './api'; // Import the central axios instance

// @desc    Create a new restock request
export const createRestockRequest = (requestData) => {
  return api.post('/restocks', requestData);
};

// @desc    Get all restock requests
export const getAllRestockRequests = () => {
  return api.get('/restocks');
};

// @desc    Get a single restock request by its ID
export const getRestockRequestById = (id) => {
  return api.get(`/restocks/${id}`);
};

// @desc    Record the arrival of stock for a specific request item
export const recordArrival = (requestId, arrivalData) => {
  return api.post(`/restocks/${requestId}/record-arrival`, arrivalData);
};

// @desc    Update the status of a restock request (e.g., to 'Processing' or 'Cancelled')
export const updateRestockRequestStatus = (requestId, statusData) => {
  return api.patch(`/restocks/${requestId}/status`, statusData);
};

export const updateShippedQuantity = (requestId, shippedData) => {
    return api.patch(`/restocks/${requestId}/update-shipped`, shippedData);
  };

  export const editRestockRequest = (requestId, requestData) => {
    return api.put(`/restocks/${requestId}`, requestData);
  };
  
  // @desc    Force a request to a 'Completed with Discrepancy' state
  export const forceCompleteRequest = (requestId) => {
    return api.patch(`/restocks/${requestId}/force-complete`);
  };

  export const editArrivalHistory = (requestId, editData) => {
    return api.patch(`/restocks/${requestId}/edit-arrival`, editData);
  };