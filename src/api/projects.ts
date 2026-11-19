import { bearerAuthHeader, getJson, projectImageUrl } from './http';
import { getApiBaseUrl } from './config';
import { parseProjectDetail, parseProjectPage } from '../types/project';

export interface ProjectSave {
  generation: number;
  title: string;
  subtitle: string | null;
  description: string;
  banner: string | null;
  logo: string | null;
  stacks: string[];
  members: { name: string; role: string }[];
}

async function saveRequest(path: string, body: BodyInit, json: boolean) {
  const headers: Record<string, string> = bearerAuthHeader(localStorage.getItem('accessToken'));
  if (json) headers['Content-Type'] = 'application/json';
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, { method: 'POST', headers, body });
  } catch {
    throw new Error('서버에 연결하지 못했습니다. 입력 내용은 유지됩니다. 등록 여부를 목록에서 확인해주세요.');
  }
  if (response.status === 401) throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
  if (response.status === 403) throw new Error('프로젝트는 관리자만 등록할 수 있습니다.');
  if (response.status === 413) throw new Error('이미지는 파일당 5MB 이하로 선택해주세요.');
  if (response.status === 400) throw new Error('입력값 또는 이미지 형식을 확인해주세요. 이미지는 PNG/JPEG, 5MB 이하, 1600만 화소 이하만 지원합니다.');
  if (!response.ok) throw new Error('프로젝트 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  return response.json() as Promise<unknown>;
}

export async function createProject(project: ProjectSave) {
  return parseProjectDetail(await saveRequest('/api/projects', JSON.stringify(project), true));
}

export async function uploadProjectImage(file: File) {
  if (!['image/png', 'image/jpeg'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('PNG/JPEG 이미지 파일을 5MB 이하로 선택해주세요.');
  }
  const form = new FormData();
  form.append('file', file);
  const result = await saveRequest('/api/projects/images', form, false);
  if (typeof result !== 'object' || result === null || !('url' in result) || typeof result.url !== 'string') {
    throw new Error('이미지 업로드 응답을 확인할 수 없습니다.');
  }
  return result.url;
}

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
