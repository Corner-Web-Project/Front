import { useParams, useNavigate } from 'react-router-dom';
import { DUMMY_POSTS, type Post } from '../types/types';

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

  const post = DUMMY_POSTS.find((item) => item.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-[#333333]">게시글을 찾을 수 없습니다.</h1>
        <button
          onClick={() => navigate('/Notice')}
          className="px-4 py-2 rounded-full bg-[#3B82F6] text-white text-sm hover:bg-[#2563EB] transition"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333333] font-sans antialiased pb-20">
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

          <div className="mt-3 flex gap-4 text-xs text-[#9CA3AF] font-light">
            <span>{post.author}</span>
            <span>{post.createdAt}</span>
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
