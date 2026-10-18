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
