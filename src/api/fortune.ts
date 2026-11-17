import type { FortuneResult, FortuneStatsResponse } from '../types/fortune';
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
  if (!response.ok) throw new ApiError(response.status, `${fallbackMessage} (${response.status})`);
  return response.json();
}

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
