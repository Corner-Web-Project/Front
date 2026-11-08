import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Post } from '../types/types';
import { createPost, getPost, updatePost } from '../api/post';
import { useAuth } from '../context/auth';

type Category = Post['category'];

// 공지사항 / FAQ는 운영진(ADMIN)만 작성 가능, 일반 회원은 질문만
const ADMIN_CATEGORIES: Category[] = ['공지사항', 'FAQ', '질문'];
const MEMBER_CATEGORIES: Category[] = ['질문'];

// /Notice/write 는 작성, /Notice/:id/edit 는 수정 화면으로 사용
export default function NoticeWrite() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = user?.role === 'ADMIN' ? ADMIN_CATEGORIES : MEMBER_CATEGORIES;
  const [selectedCategory, setCategory] = useState<Category>('공지사항');
  // 선택한 카테고리를 쓸 수 없는 권한이면 질문으로 작성
  const category = categories.includes(selectedCategory) ? selectedCategory : '질문';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 수정 모드: 기존 게시글을 불러와 입력값을 채운다
  const [original, setOriginal] = useState<{ id: string; post: Post | null; error: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    getPost(id)
      .then((post) => {
        if (ignore) return;
        setOriginal({ id, post, error: '' });
        if (post) {
          setCategory(post.category);
          setTitle(post.title);
          setContent(post.content ?? '');
        }
      })
      .catch((e: Error) => {
        if (!ignore) setOriginal({ id, post: null, error: e.message });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const loading = isEdit && original?.id !== id;
  const originalPost = isEdit && !loading ? original?.post ?? null : null;
  // 수정 시에는 원래 작성자 이름을 표시
  const author = (isEdit ? originalPost?.author : user?.name) ?? '';
  // 작성자 본인 또는 운영진(ADMIN)만 수정 가능 (실제 권한 검사는 Back에서)
  const canEdit = !!user && !!originalPost && (user.role === 'ADMIN' || user.memberId === originalPost.authorId);
  const backPath = isEdit ? `/Notice/${id}` : '/Notice';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert('로그인 후 게시글을 작성해주세요.');
      return;
    }

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('제목, 작성자, 내용을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && originalPost) {
        await updatePost(originalPost.id, {
          category,
          title: title.trim(),
          content: content.trim(),
          // 상단 고정 여부는 수정 화면에서 바꾸지 않고 그대로 유지
          isPinned: originalPost.isPinned ?? false,
        });
        navigate(`/Notice/${originalPost.id}`);
        return;
      }
      const createdId = await createPost({
        category,
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/Notice/${createdId}`);
    } catch (error) {
      alert((error as Error).message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3F0] flex items-center justify-center text-sm text-gray-500">
        불러오는 중...
      </div>
    );
  }

  if (isEdit && (!originalPost || (user && !canEdit))) {
    return (
      <div className="min-h-screen bg-[#F8F3F0] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-[#333333]">
          {!originalPost ? original?.error || '게시글을 찾을 수 없습니다.' : '작성자 본인 또는 운영진만 수정할 수 있습니다.'}
        </h1>
        <button
          onClick={() => navigate(backPath)}
          className="px-4 py-2 rounded-full bg-[#3B82F6] text-white text-sm hover:bg-[#2563EB] transition"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#333333] font-sans antialiased pb-20">
      <main className="max-w-3xl mx-auto px-4 pt-12">
        <section className="text-center mb-10">
          <h1 className="text-5xl font-light tracking-widest text-[#111827] mb-4">{isEdit ? 'EDIT' : 'WRITE'}</h1>
          <p className="text-[#6B7280] text-sm">{isEdit ? '게시글을 수정하세요' : '새로운 게시글을 작성하세요'}</p>
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                  category === c
                    ? 'bg-[#3B82F6] text-white ring-2 ring-blue-300'
                    : 'bg-[#E5E7EB] text-[#4B5563] hover:bg-gray-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b border-gray-300 py-3 text-lg text-[#111827] focus:outline-none focus:border-[#3B82F6] transition"
          />

          <input
            type="text"
            placeholder="작성자"
            value={author}
            readOnly
            className="w-full border-b border-gray-300 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#3B82F6] transition"
          />

          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border border-gray-300 rounded-xl p-4 text-sm leading-7 text-[#374151] focus:outline-none focus:border-[#3B82F6] transition resize-none"
          />

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="px-5 py-2.5 rounded-full text-sm text-[#4B5563] bg-[#E5E7EB] hover:bg-gray-300 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition disabled:opacity-50"
            >
              {isEdit ? (submitting ? '수정 중...' : '수정') : (submitting ? '등록 중...' : '등록')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
