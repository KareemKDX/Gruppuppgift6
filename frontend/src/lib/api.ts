import axios from "axios";
import { getToken, API_URL } from "../auth";

const api = axios.create({
  baseURL: API_URL,
});

// lägg till token automatiskt om den finns
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const PLAYLISTS_CHANGED = "playlists-changed";
