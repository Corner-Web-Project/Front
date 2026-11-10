import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Post } from '../types/types';
import { deletePost, getPost } from '../api/post';
import { useAuth } from '../context/auth';

const getCategoryBadgeStyle = (category: Post['category']) => {
  switch (category) {
    case '공지사항':
      return 'bg-[#4A0E0E] text-white';
    case 'FAQ':
      return 'bg-[#1E1B4B] text-white';
    case '질문':
      return 'bg-[#71717A] text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState<{ id: string; post: Post | null; error: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    getPost(id)
      .then((post) => {
        if (!ignore) setResult({ id, post, error: '' });
      })
      .catch((e: Error) => {
        if (!ignore) setResult({ id, post: null, error: e.message });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  // 현재 id의 응답이 아직 안 왔으면 로딩 중
  const loading = result?.id !== id;
  const post = loading ? null : result?.post ?? null;
  const error = (!loading && result?.error) || '';

  // 작성자 본인 또는 운영진(ADMIN)만 수정 / 삭제 가능 (실제 권한 검사는 Back에서)
  const canEdit = !!user && !!post && (user.role === 'ADMIN' || user.memberId === post.authorId);

  const handleDelete = async () => {
    if (!post || !window.confirm('게시글을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      navigate('/Notice');
    } catch (e) {
      alert((e as Error).message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3F0] flex items-center justify-center text-sm text-gray-500">
        불러오는 중...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8F3F0] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-[#333333]">{error || '게시글을 찾을 수 없습니다.'}</h1>
        <button
          onClick={() => navigate('/Notice')}
          className="rounded-md border border-[#014BAA] px-3 py-1 text-sm text-[#014BAA] transition hover:bg-[#014BAA] hover:text-white"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#333333] font-sans antialiased pb-20">
      <main className="max-w-5xl mx-auto px-4 pt-12">
        <button
          onClick={() => navigate('/Notice')}
          className="text-sm text-[#9CA3AF] hover:text-[#3B82F6] transition mb-6"
        >
          ← 목록으로
        </button>

        <div className="border-b border-gray-200 pb-6 mb-8">
          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${getCategoryBadgeStyle(post.category)}`}>
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-medium text-[#111827]">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center gap-4 text-xs text-[#9CA3AF] font-light">
            <span>{post.author}</span>
            <span>{post.createdAt}</span>

            {canEdit && (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => navigate(`/Notice/${post.id}/edit`)}
                  className="rounded-md border border-[#014BAA] px-3 py-1 text-sm text-[#014BAA] transition hover:bg-[#014BAA] hover:text-white"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-md border border-[#EF4444] px-3 py-1 text-sm text-[#EF4444] transition hover:bg-[#EF4444] hover:text-white disabled:opacity-50"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="leading-8 text-[#374151] text-sm space-y-4">
          {post.paragraphs && post.paragraphs.length > 0 ? (
            post.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p className="text-gray-400">등록된 내용이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}
