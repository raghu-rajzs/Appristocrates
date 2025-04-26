// frontend/src/api/pricingAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this to env variable for production

export const getPricingPrediction = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/estimate`, formData);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
