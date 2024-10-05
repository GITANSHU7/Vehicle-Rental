import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getVehicleTypes = () => axios.get(`${API_URL}/vehicle-types`);
export const getVehicles = (typeId) => axios.get(`${API_URL}/vehicles/${typeId}`);
export const createBooking = (bookingData) => axios.post(`${API_URL}/bookings`, bookingData);

