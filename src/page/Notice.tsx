import React, { useState } from 'react';
import { Pencil } from 'lucide-react'; // 글쓰기 버튼 아이콘용
import { DUMMY_POSTS, type Post } from '../types/types';

type CategoryFilter = '전체' | '공지사항' | 'FAQ' | '질문';

const NoticePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('전체');
  const [posts] = useState<Post[]>(DUMMY_POSTS);

  // 카테고리 필터링 로직
  const filteredPosts = selectedCategory === '전체'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

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
    alert('글쓰기 페이지로 이동하거나 모달을 띄웁니다.');
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
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 text-sm hover:bg-gray-50/50 transition">
                    <td className="py-4 text-center text-[#9CA3AF]">{post.no}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${getCategoryBadgeStyle(post.category)}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 pl-4 font-medium text-[#1F2937] cursor-pointer hover:text-blue-600 transition">
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