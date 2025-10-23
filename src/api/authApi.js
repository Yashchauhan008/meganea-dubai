import axios from 'axios';

// Use Create React App's way of reading environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api/auth';

const api = axios.create({
  baseURL: API_URL,
} );

// ... the rest of the file remains the same

/**
 * Registers a new user.
 * @param {object} userData - { username, email, password, role }
 * @returns {Promise<object>} The server response data.
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

/**
 * Logs in a user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The server response data, including the token.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

/**
 * Fetches the current user's data using the stored token.
 * @returns {Promise<object>} The user data.
 */
export const getMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await api.get('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        // If the token is invalid, remove it
        localStorage.removeItem('token');
        throw error.response?.data || { message: 'Session expired. Please log in again.' };
    }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
