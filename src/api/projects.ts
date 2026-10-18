import { getJson, projectImageUrl } from './http';
import { getApiBaseUrl } from './config';
import { parseProjectDetail, parseProjectPage } from '../types/project';

export function getProjects(generation: number, page: number, signal: AbortSignal) {
  const params = new URLSearchParams({ generation: String(generation), page: String(page), size: '12' });
  return getJson<unknown>(getApiBaseUrl(), `/api/projects?${params}`, signal).then(parseProjectPage);
}

export function getProject(id: string, signal: AbortSignal) {
  return getJson<unknown>(getApiBaseUrl(), `/api/projects/${encodeURIComponent(id)}`, signal).then(parseProjectDetail);
}

export function projectImage(value: string | null) {
  return projectImageUrl(value, getApiBaseUrl());
}
