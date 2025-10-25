import api from './api'; // <-- IMPORT THE CENTRAL INSTANCE

// --- Booking API Functions ---

export const getAllBookings = (params) => api.get('/bookings', { params });

export const getBookingById = (id) => api.get(`/bookings/${id}`);

export const createBooking = (bookingData) => api.post('/bookings', bookingData);

export const updateBooking = (id, bookingData) => api.put(`/bookings/${id}`, bookingData);

export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
