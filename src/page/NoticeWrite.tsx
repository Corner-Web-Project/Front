import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Post } from '../types/types';
import { createPost } from '../api/post';
import { useAuth } from '../context/auth';

type Category = Post['category'];

export default function NoticeWrite() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState<Category>('공지사항');
  const [title, setTitle] = useState('');
  const author = user?.name ?? '';
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      const id = await createPost({
        category,
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/Notice/${id}`);
    } catch (error) {
      alert((error as Error).message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333333] font-sans antialiased pb-20">
      <main className="max-w-3xl mx-auto px-4 pt-12">
        <section className="text-center mb-10">
          <h1 className="text-5xl font-light tracking-widest text-[#111827] mb-4">WRITE</h1>
          <p className="text-[#6B7280] text-sm">새로운 게시글을 작성하세요</p>
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-2">
            {(['공지사항', 'FAQ', '질문'] as Category[]).map((c) => (
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
              onClick={() => navigate('/Notice')}
              className="px-5 py-2.5 rounded-full text-sm text-[#4B5563] bg-[#E5E7EB] hover:bg-gray-300 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition disabled:opacity-50"
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
