import axios from "axios";

export const API_URL = "http://localhost:4001";

const TOKEN_KEY = "musicplate_token";

export type User = {
  id: number;
  username: string;
  email: string;
  subscription_id: number | null;
  role: string;
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common.Authorization;
}

const savedToken = getToken();
if (savedToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}
