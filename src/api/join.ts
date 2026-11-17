import { apiUrl } from './config';
import { bearerAuthHeader } from './http';

interface JoinApplication {
  name: string;
  studentId: string;
  major: string;
  phone: string;
  motivation: string;
  portfolioUrl: string | null;
  comment: string;
}

export async function submitJoinApplication(url: string, application: JoinApplication): Promise<void> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(application),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error('가입 신청 서버에 연결하지 못했습니다. 서버 주소와 연결 상태를 확인한 뒤 다시 시도해주세요.');
  }

  if (!response.ok) {
    let message = response.status === 400
      ? '입력 내용을 확인해주세요. 이름 50자, 학번 20자, 학과 50자, 지원동기 500자 이내로 입력해주세요.'
      : `가입 신청에 실패했습니다. (${response.status})`;
    try {
      const error = await response.json();
      message = error.detail || error.message || message;
    } catch {
      // Use the status-based message for empty or non-JSON errors.
    }
    throw new Error(message);
  }

  const result = await response.json().catch(() => null);
  if (!result || !Number.isSafeInteger(result.joinId) || result.joinId <= 0) {
    throw new Error('가입 신청 저장 결과를 확인하지 못했습니다. 백엔드 주소와 서버 응답을 확인해주세요.');
  }
}

// 가입 신청 심사 상태
export type JoinStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 가입 신청 목록 / 상세 응답 (운영진 전용)
export interface JoinApplicationSummary {
  joinId: number;
  name: string;
  studentId: string;
  major: string;
  status: JoinStatus;
  createdAt: string;
}

export interface JoinApplicationDetail extends JoinApplicationSummary {
  phone: string;
  motivation: string;
  portfolioUrl: string | null;
  comment: string;
}

interface JoinApplicationPageResponse {
  applications: JoinApplicationSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 403 / 404 이면 서버가 보낸 사유를, 아니면 기본 메시지를 사용
async function getAdminErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  if (![403, 404].includes(response.status)) return defaultMessage;
  const error = await response.json().catch(() => null);
  return error?.message || defaultMessage;
}

function adminAuthHeader() {
  return bearerAuthHeader(localStorage.getItem('accessToken'));
}

// 가입 신청 목록 (최신순). 운영진이 아니면 403
export async function getJoinApplications(): Promise<JoinApplicationSummary[]> {
  // TODO: 신청이 많아지면 페이지네이션 UI 추가
  const response = await fetch(apiUrl('/api/join-applications?page=0&size=100'), { headers: adminAuthHeader() });
  if (!response.ok) throw new Error(await getAdminErrorMessage(response, '가입 신청 목록을 불러오지 못했습니다.'));
  const data: JoinApplicationPageResponse = await response.json();
  return data.applications;
}

// 가입 신청 상세 (연락처, 지원동기 등 포함)
export async function getJoinApplication(joinId: number): Promise<JoinApplicationDetail> {
  const response = await fetch(apiUrl(`/api/join-applications/${joinId}`), { headers: adminAuthHeader() });
  if (!response.ok) throw new Error(await getAdminErrorMessage(response, '가입 신청을 불러오지 못했습니다.'));
  return response.json();
}

// 가입 신청 심사 상태 변경 (승인 등)
export async function updateJoinApplicationStatus(joinId: number, status: JoinStatus): Promise<JoinApplicationDetail> {
  const response = await fetch(apiUrl(`/api/join-applications/${joinId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeader() },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(await getAdminErrorMessage(response, '가입 신청 상태 변경에 실패했습니다.'));
  return response.json();
}

// 가입 신청 삭제
export async function deleteJoinApplication(joinId: number): Promise<void> {
  const response = await fetch(apiUrl(`/api/join-applications/${joinId}`), {
    method: 'DELETE',
    headers: adminAuthHeader(),
  });
  if (!response.ok) throw new Error(await getAdminErrorMessage(response, '가입 신청 삭제에 실패했습니다.'));
}
