import { apiBaseUrl, getJson, projectImageUrl } from './http';
import { parseProjectDetail, parseProjectPage } from '../types/project';

function baseUrl() {
  return apiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD);
}

export function getProjects(generation: number, page: number, signal: AbortSignal) {
  const params = new URLSearchParams({ generation: String(generation), page: String(page), size: '12' });
  return getJson<unknown>(baseUrl(), `/api/projects?${params}`, signal).then(parseProjectPage);
}

export function getProject(id: string, signal: AbortSignal) {
  return getJson<unknown>(baseUrl(), `/api/projects/${encodeURIComponent(id)}`, signal).then(parseProjectDetail);
}

export function projectImage(value: string | null) {
  return projectImageUrl(value, baseUrl());
}
