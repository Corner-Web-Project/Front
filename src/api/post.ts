import type { Post } from '../types/types';
import { apiUrl } from './config';
import { bearerAuthHeader } from './http';

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
  authorId: number;
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

  const response = await fetch(apiUrl(`/api/posts?${params}`));
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
  const response = await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`));
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.');

  const data: PostDetailResponse = await response.json();
  return {
    ...toPost(data, data.isPinned ? '-' : ''),
    paragraphs: data.content.split('\n').filter((line) => line.trim() !== ''),
    content: data.content,
    authorId: data.authorId,
    isPinned: data.isPinned,
  };
};

// 작성. 생성된 게시글 id 반환
export const createPost = async (post: {
  category: Post['category'];
  title: string;
  content: string;
}): Promise<string> => {
  const authHeader = bearerAuthHeader(localStorage.getItem('accessToken'));
  const response = await fetch(apiUrl('/api/posts'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify({
      category: CATEGORY_CODE[post.category],
      title: post.title,
      content: post.content,
    }),
  });
  if (response.status === 403) throw new Error('공지사항 / FAQ 작성은 운영진만 할 수 있습니다.');
  if (!response.ok) throw new Error('게시글 등록에 실패했습니다.');

  const data: PostDetailResponse = await response.json();
  return String(data.postId);
};

// 403(권한 없음)이면 서버가 보낸 사유를, 아니면 기본 메시지를 사용
const getErrorMessage = async (response: Response, defaultMessage: string) => {
  if (response.status !== 403) return defaultMessage;
  const error = await response.json().catch(() => null);
  return error?.message || defaultMessage;
};

// 수정. 작성자 본인 또는 운영진만 가능 (아니면 403)
export const updatePost = async (
  id: string,
  post: {
    category: Post['category'];
    title: string;
    content: string;
    isPinned: boolean;
  }
): Promise<void> => {
  const authHeader = bearerAuthHeader(localStorage.getItem('accessToken'));
  const response = await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify({
      category: CATEGORY_CODE[post.category],
      title: post.title,
      content: post.content,
      isPinned: post.isPinned,
    }),
  });
  if (!response.ok) throw new Error(await getErrorMessage(response, '게시글 수정에 실패했습니다.'));
};

// 삭제. 작성자 본인 또는 운영진만 가능 (아니면 403)
export const deletePost = async (id: string): Promise<void> => {
  const authHeader = bearerAuthHeader(localStorage.getItem('accessToken'));
  const response = await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: authHeader,
  });
  if (!response.ok) throw new Error(await getErrorMessage(response, '게시글 삭제에 실패했습니다.'));
};
