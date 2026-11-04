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
