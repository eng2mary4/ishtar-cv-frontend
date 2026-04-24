import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// Fix photo URL helper - use everywhere
export function fixPhoto(photo) {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_URL}${photo}`;
}

export default api;
