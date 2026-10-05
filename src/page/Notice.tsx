import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react'; // 글쓰기 버튼 아이콘용
import { type Post } from '../types/types';
import { getPosts } from '../api/post';

type CategoryFilter = '전체' | '공지사항' | 'FAQ' | '질문';

const NoticePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('전체');
  const [result, setResult] = useState<{ category: CategoryFilter; posts: Post[]; error: string } | null>(null);

  // 카테고리가 바뀔 때마다 API로 목록 조회 ('전체'면 카테고리 조건 없음)
  useEffect(() => {
    let ignore = false;
    getPosts(selectedCategory === '전체' ? undefined : selectedCategory)
      .then((posts) => {
        if (!ignore) setResult({ category: selectedCategory, posts, error: '' });
      })
      .catch((e: Error) => {
        if (!ignore) setResult({ category: selectedCategory, posts: [], error: e.message });
      });
    return () => {
      ignore = true;
    };
  }, [selectedCategory]);

  // 선택한 카테고리의 응답이 아직 안 왔으면 로딩 중
  const loading = result?.category !== selectedCategory;
  const posts = (!loading && result?.posts) || [];
  const error = (!loading && result?.error) || '';

  // 카테고리별 배지 스타일 지정 함수
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

  const handleWriteClick = () => {
    navigate('/Notice/write');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333333] font-sans antialiased relative pb-20">
      {/* 1. 타이틀 섹션 (상단 마진을 mt-12로 다소 조정하여 공통 헤더와의 간격을 최적화) */}
      <main className="max-w-5xl mx-auto px-4 pt-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-widest text-[#111827] mb-4">NOTICE</h1>
          <p className="text-[#6B7280] text-sm">구석방의 공지사항 및 다양한 소식을 확인하세요</p>
        </section>

        {/* 2. 카테고리 필터 탭 */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-4">
          {(['전체', '공지사항', 'FAQ', '질문'] as CategoryFilter[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                selectedCategory === category
                  ? 'bg-[#3B82F6] text-white ring-2 ring-blue-300'
                  : 'bg-[#E5E7EB] text-[#4B5563] hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 3. 게시글 목록 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-400 text-xs text-[#9CA3AF] font-medium">
                <th className="py-3 w-16 text-center">No</th>
                <th className="py-3 w-24 text-center">카테고리</th>
                <th className="py-3 pl-4">제목</th>
                <th className="py-3 w-24 text-center">작성자</th>
                <th className="py-3 w-28 text-center">작성일</th>
              </tr>
            </thead>
            <tbody>
              {loading || error || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                    {loading ? '불러오는 중...' : error || '등록된 게시글이 없습니다.'}
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => navigate(`/Notice/${post.id}`)}
                    className="border-b border-gray-200 text-sm hover:bg-gray-50/50 transition cursor-pointer"
                  >
                    <td className="py-4 text-center text-[#9CA3AF]">{post.no}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${getCategoryBadgeStyle(post.category)}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 pl-4 font-medium text-[#1F2937] hover:text-blue-600 transition">
                      {post.title}
                    </td>
                    <td className="py-4 text-center text-[#D1D5DB] text-xs font-light">{post.author}</td>
                    <td className="py-4 text-center text-[#D1D5DB] text-xs font-light">{post.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* 4. 우측 하단 글쓰기 플로팅 버튼 */}
      <button
        onClick={handleWriteClick}
        className="fixed bottom-8 right-8 flex items-center space-x-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 z-50 group"
        aria-label="글쓰기"
      >
        <Pencil className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        <span className="font-medium text-sm">글쓰기</span>
      </button>
    </div>
  );
};

export default NoticePage;