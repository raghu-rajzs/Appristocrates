// frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Adjust if using a different port or server

export const getPricingPrediction = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      location: formData.location,
      roomType: formData.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      amenities: formData.amenities,
    });

    return response.data;
  } catch (error) {
    console.error('API error:', error);
    return null;
  }
};
