import { apiBaseUrl } from './http';

// Validate when a request starts so invalid configuration appears in the page's error state.
// An empty value means same-origin relative paths (Netlify proxy / Vite server.proxy).
export function getApiBaseUrl() {
  return apiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
}

export function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}
