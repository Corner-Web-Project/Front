export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function bearerAuthHeader(accessToken: string | null): { Authorization: string } {
  if (!accessToken?.trim()) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
  return { Authorization: `Bearer ${accessToken.trim().replace(/^Bearer\s+/i, '')}` };
}

export function apiBaseUrl(value: string | undefined, production: boolean): string {
  // 비어 있으면 같은 출처의 /api/... 상대 경로로 요청 (Netlify 프록시, Vite server.proxy)
  if (!value?.trim()) return '';
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("VITE_API_BASE_URL에 올바른 백엔드 주소를 설정해주세요.");
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("VITE_API_BASE_URL에 인증정보·쿼리 없는 HTTP(S) 주소를 설정해주세요.");
  }
  if (production && url.protocol !== 'https:') {
    throw new Error("운영 백엔드 주소는 HTTPS여야 합니다.");
  }
  if (production && (url.hostname === 'localhost' || url.hostname.endsWith('.localhost')
    || /^127\./.test(url.hostname) || url.hostname === '[::1]' || url.hostname === '0.0.0.0')) {
    throw new Error("운영 백엔드 주소에 로컬 주소를 사용할 수 없습니다.");
  }
  return url.href.replace(/\/+$/, '');
}

export async function getJson<T>(baseUrl: string, path: string, signal: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
  if (!response.ok) throw new ApiError(response.status, `프로젝트를 불러오지 못했습니다. (${response.status})`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error("API가 JSON을 반환하지 않았습니다. 백엔드 주소를 확인해주세요.");
  }
  return response.json();
}

// Relative DTO image paths belong to the backend, not the Netlify SPA.
export function projectImageUrl(value: string | null, baseUrl: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, `${baseUrl || globalThis.location?.origin}/`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
