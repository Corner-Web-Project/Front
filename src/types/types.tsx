// types.ts (목록과 상세 페이지 통합 데이터 구조 정의)

export interface Post {
  id: string;
  no: string;                    // 목록 페이지의 번호 표시용 ('-' 또는 '002')
  category: '공지사항' | 'FAQ' | '질문'; // 카테고리 종류 제한 규칙 유지
  title: string;
  author: string;
  createdAt: string;             // 작성일 (기존 'createdAt'으로 통일)
  paragraphs?: string[];         // [선택 항목] 상세 페이지의 본문 글 상자 배열 (목록에서는 제외 가능)
}

// 두 페이지에서 공용으로 사용할 수 있는 확장된 더미 데이터
export const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    no: '-',
    category: '공지사항',
    title: '2026학년도 구석방 1학기 정규 일정 안내',
    author: '운영진',
    createdAt: '2026. 05. 05.',
    paragraphs: [
      '안녕하세요, 구석방 운영진입니다.',
      '2026학년도 1학기 구석방의 정규 일정을 안내해 드립니다.',
      '이번 학기에는 다양한 프로젝트와 스터디 세션이 준비되어 있으니 회원 여러분의 많은 참여를 부탁드립니다.',
      '자세한 일정표는 첨부파일을 확인해 주시기 바랍니다.',
      '감사합니다.',
    ],
  },
  {
    id: '2',
    no: '002',
    category: 'FAQ',
    title: '아이디 변경 관련 용무있습니다.',
    author: '홍길동',
    createdAt: '2026. 07. 07.',
    paragraphs: [
      '아이디 변경은 마이페이지 설정에서 가능합니다.',
      '추가적인 문의 사항이 있다면 운영진에게 연락 바랍니다.'
    ]
  },
  {
    id: '3',
    no: '001',
    category: '질문',
    title: '동아리 방 위치가 어디인가요?',
    author: '김철수',
    createdAt: '2026. 07. 07.',
    paragraphs: [
      '공학관 4층 401호에 위치하고 있습니다.'
    ]
  },
];