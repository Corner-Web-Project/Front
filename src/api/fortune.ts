import type { FortuneResult, FortuneStatsResponse, Phrase, PhraseInput } from '../types/fortune';
import { apiUrl } from './config';
import { ApiError } from './http';
import * as mock from './fortuneMock';

// VITE_FORTUNE_MOCK=true 이면 백엔드 없이 브라우저 안에서 동작하는 mock을 사용한다.
const useMock = import.meta.env.VITE_FORTUNE_MOCK === 'true';

async function request<T>(path: string, init: RequestInit = {}, fallbackMessage: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...init,
      headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
      signal: init.signal ?? AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
  if (response.status === 401) throw new ApiError(401, '관리자 비밀번호가 올바르지 않습니다.');
  if (!response.ok) throw new ApiError(response.status, `${fallbackMessage} (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

const adminHeaders = (password: string) => ({ 'X-Admin-Password': password });

export const drawFortune = (name: string): Promise<FortuneResult> =>
  useMock
    ? mock.drawFortune(name)
    : request('/api/fortunes', { method: 'POST', body: JSON.stringify({ name }) }, '운세를 뽑지 못했습니다.');

/** 공유 링크용 결과 조회. 없으면 null */
export const getFortune = async (id: string, signal?: AbortSignal): Promise<FortuneResult | null> => {
  if (useMock) return mock.getFortune(id);
  try {
    return await request(`/api/fortunes/${encodeURIComponent(id)}`, { signal }, '운세 결과를 불러오지 못했습니다.');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
};

export const getFortuneStats = (signal?: AbortSignal): Promise<FortuneStatsResponse> =>
  useMock ? mock.getFortuneStats() : request('/api/fortunes/stats', { signal }, '통계를 불러오지 못했습니다.');

// ---- 관리자 ----

export const getPhrases = (password: string, type?: string): Promise<Phrase[]> => {
  if (useMock) return mock.getPhrases(password, type);
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  return request(`/api/admin/fortune-phrases${query}`, { headers: adminHeaders(password) }, '문구 목록을 불러오지 못했습니다.');
};

export const createPhrase = (password: string, input: PhraseInput): Promise<Phrase> =>
  useMock
    ? mock.createPhrase(password, input)
    : request('/api/admin/fortune-phrases', { method: 'POST', headers: adminHeaders(password), body: JSON.stringify(input) }, '문구를 추가하지 못했습니다.');

export const updatePhrase = (password: string, id: number, input: PhraseInput): Promise<Phrase> =>
  useMock
    ? mock.updatePhrase(password, id, input)
    : request(`/api/admin/fortune-phrases/${id}`, { method: 'PUT', headers: adminHeaders(password), body: JSON.stringify(input) }, '문구를 수정하지 못했습니다.');

export const deletePhrase = (password: string, id: number): Promise<void> =>
  useMock
    ? mock.deletePhrase(password, id)
    : request(`/api/admin/fortune-phrases/${id}`, { method: 'DELETE', headers: adminHeaders(password) }, '문구를 삭제하지 못했습니다.');
