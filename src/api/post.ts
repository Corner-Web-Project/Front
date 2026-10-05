import type { Post } from '../types/types';

// .env.local 이 없으면 로컬 Back 주소 사용. 배포 시 Netlify 환경변수에 VITE_API_URL 설정 필요
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// Back 게시판 API 응답 형식
type PostCategoryCode = 'NOTICE' | 'FAQ' | 'QNA';

interface PostSummaryResponse {
  postId: number;
  category: PostCategoryCode;
  title: string;
  authorName: string;
  isPinned: boolean;
  viewCount: number;
  createDate: string;
}

interface PostDetailResponse extends PostSummaryResponse {
  content: string;
  updateDate: string;
}

interface PostPageResponse {
  posts: PostSummaryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 화면 표시명 <-> API 카테고리 코드
const CATEGORY_LABEL: Record<PostCategoryCode, Post['category']> = {
  NOTICE: '공지사항',
  FAQ: 'FAQ',
  QNA: '질문',
};

const CATEGORY_CODE: Record<Post['category'], PostCategoryCode> = {
  공지사항: 'NOTICE',
  FAQ: 'FAQ',
  질문: 'QNA',
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

const toPost = (post: PostSummaryResponse, no: string): Post => ({
  id: String(post.postId),
  no,
  category: CATEGORY_LABEL[post.category],
  title: post.title,
  author: post.authorName,
  createdAt: formatDate(post.createDate),
});

// 목록 조회 (category 생략 시 전체). 고정 글은 No '-', 나머지는 최신 글부터 큰 번호
export const getPosts = async (category?: Post['category']): Promise<Post[]> => {
  // TODO: 목록 페이지네이션 UI가 생기면 page/size를 화면에서 받도록 변경
  const params = new URLSearchParams({ page: '0', size: '100' });
  if (category) params.set('category', CATEGORY_CODE[category]);

  const response = await fetch(`${API_URL}/api/posts?${params}`);
  if (!response.ok) throw new Error('게시글 목록을 불러오지 못했습니다.');

  const data: PostPageResponse = await response.json();
  const pinnedCount = data.posts.filter((post) => post.isPinned).length;
  let no = data.totalElements - pinnedCount;

  return data.posts.map((post) =>
    toPost(post, post.isPinned ? '-' : String(no--).padStart(3, '0'))
  );
};

// 상세 조회. 없는 글이면 null
export const getPost = async (id: string): Promise<Post | null> => {
  const response = await fetch(`${API_URL}/api/posts/${id}`);
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.');

  const data: PostDetailResponse = await response.json();
  return {
    ...toPost(data, data.isPinned ? '-' : ''),
    paragraphs: data.content.split('\n').filter((line) => line.trim() !== ''),
  };
};

// 작성. 생성된 게시글 id 반환
export const createPost = async (post: {
  category: Post['category'];
  title: string;
  author: string;
  content: string;
}): Promise<string> => {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: CATEGORY_CODE[post.category],
      title: post.title,
      content: post.content,
      authorName: post.author,
    }),
  });
  if (!response.ok) throw new Error('게시글 등록에 실패했습니다.');

  const data: PostDetailResponse = await response.json();
  return String(data.postId);
};
