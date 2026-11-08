import { apiUrl } from './config';
import { bearerAuthHeader } from './http';

// Back 회원 API 응답 형식
export interface Member {
  memberId: number;
  studentId: string;
  name: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  createDate: string;
}

interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

// 회원가입. 학번 / 이메일 중복이면 409
export const createMember = async (member: {
  studentId: string;
  password: string;
  name: string;
  email: string;
}): Promise<Member> => {
  const response = await fetch(apiUrl('/api/members'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(member),
  });
  if (response.status === 409) throw new Error('이미 가입된 학번 또는 이메일입니다.');
  if (response.status === 400) throw new Error('입력값을 확인해주세요. (비밀번호 8자 이상, 올바른 이메일 형식)');
  if (!response.ok) throw new Error('회원가입에 실패했습니다.');
  return response.json();
};

// 로그인. 성공하면 Access Token 반환
export const createToken = async (login: {
  studentId: string;
  password: string;
}): Promise<string> => {
  const response = await fetch(apiUrl('/api/auth/tokens'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login),
  });
  if (response.status === 401 || response.status === 400) throw new Error('학번 또는 비밀번호가 올바르지 않습니다.');
  if (!response.ok) throw new Error('로그인에 실패했습니다.');
  const data: TokenResponse = await response.json();
  return data.accessToken;
};

// 로그인한 회원 정보. 토큰이 없거나 만료되면 401
export const getMyMember = async (accessToken: string): Promise<Member> => {
  const response = await fetch(apiUrl('/api/members/me'), {
    headers: bearerAuthHeader(accessToken),
  });
  if (!response.ok) throw new Error('로그인 정보를 확인할 수 없습니다.');
  return response.json();
};

// 회원 목록 응답 (운영진 전용)
interface MemberPageResponse {
  members: Member[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 403 / 404 / 409 이면 서버가 보낸 사유를, 아니면 기본 메시지를 사용
const getErrorMessage = async (response: Response, defaultMessage: string) => {
  if (![403, 404, 409].includes(response.status)) return defaultMessage;
  const error = await response.json().catch(() => null);
  return error?.message || defaultMessage;
};

// 회원 목록 (가입순). 운영진이 아니면 403
export const getMembers = async (): Promise<Member[]> => {
  // TODO: 회원 수가 많아지면 페이지네이션 UI 추가
  const response = await fetch(apiUrl('/api/members?page=0&size=100'), {
    headers: bearerAuthHeader(localStorage.getItem('accessToken')),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response, '회원 목록을 불러오지 못했습니다.'));
  const data: MemberPageResponse = await response.json();
  return data.members;
};

// 회원 권한 변경. 본인 권한 변경(403), 마지막 운영진 강등(409)은 서버에서 막는다
export const updateMemberRole = async (memberId: number, role: Member['role']): Promise<Member> => {
  const response = await fetch(apiUrl(`/api/members/${memberId}/role`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...bearerAuthHeader(localStorage.getItem('accessToken')),
    },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response, '권한 변경에 실패했습니다.'));
  return response.json();
};
