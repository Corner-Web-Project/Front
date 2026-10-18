import { apiBaseUrl } from './http';

// Validate when a request starts so missing configuration appears in the page's error state.
export function getApiBaseUrl() {
  return apiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
}

export function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}
