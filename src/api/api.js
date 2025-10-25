// import axios from 'axios';

// // Create the single, centralized axios instance
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5500/api',
// } );

// // Use an interceptor to automatically add the auth token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export default api;

// src/api/api.js

import axios from 'axios';

// 1. Create ONE instance of axios for the entire application.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5500/api',
} );

// 2. THIS IS THE MAGIC: The Request Interceptor
// This function will automatically run for EVERY SINGLE request made with this 'api' instance.
api.interceptors.request.use((config) => {
  
  // Inside the interceptor, we get the token from localStorage.
  const token = localStorage.getItem('token');
  
  // If the token exists...
  if (token) {
    // ...we automatically add the Authorization header to the request configuration.
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // We then return the modified configuration for axios to use.
  return config;

}, (error) => Promise.reject(error));

// 3. We export this pre-configured, intelligent instance.
export default api;
