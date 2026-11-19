import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Pencil } from 'lucide-react';
import { getMyPosts, type MyPostsPage } from '../api/post';

export default function MyPosts({ accessToken }: { accessToken: string }) {
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ page: number; data?: MyPostsPage; error?: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getMyPosts(accessToken, page, controller.signal).then(
      (data) => { if (!controller.signal.aborted) setResult({ page, data }); },
      (error: Error) => { if (!controller.signal.aborted) setResult({ page, error: error.message }); },
    );
    return () => controller.abort();
  }, [accessToken, page, attempt]);

  const current = result?.page === page ? result : null;
  const data = current?.data;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#014BAA]/15 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#014BAA]/10 px-6 py-6 md:px-10">
        <h2 className="text-lg font-semibold">내가 쓴 글 {data && <span className="ml-2 text-sm font-normal text-slate-500">{data.totalElements}개</span>}</h2>
        <Link to="/Notice/write" className="inline-flex items-center gap-2 rounded-lg border border-[#014BAA]/25 px-3 py-2 text-sm hover:bg-[#014BAA]/5"><Pencil size={14} aria-hidden="true" />글쓰기</Link>
      </div>
      {!current ? (
        <p role="status" className="px-6 py-12 text-center text-sm text-slate-500">내가 쓴 글을 불러오는 중입니다.</p>
      ) : current.error ? (
        <div role="alert" className="px-6 py-10 text-center text-sm text-slate-500">
          <p>{current.error}</p>
          <button type="button" onClick={() => { setResult(null); setAttempt((value) => value + 1); }} className="mt-4 rounded-lg border border-[#014BAA]/25 px-4 py-2 text-[#014BAA]">다시 시도</button>
        </div>
      ) : data && data.totalElements === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="font-medium text-slate-600">아직 작성한 글이 없어요.</p>
          <p className="mt-2 text-sm text-slate-500">궁금한 점이 있다면 게시판에 첫 질문을 남겨 보세요.</p>
          <Link to="/Notice/write" className="mt-5 inline-block text-sm underline underline-offset-4">첫 글 작성하기</Link>
        </div>
      ) : data && (
        <>
          <ul className="divide-y divide-[#014BAA]/10 px-6 md:px-10">
            {data.posts.map((post) => (
              <li key={post.id}>
                <Link to={`/Notice/${post.id}`} className="group flex items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-[#014BAA]">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className="rounded bg-[#014BAA]/5 px-2 py-1">{post.category}</span>
                      <span className="text-slate-400">{post.createdAt}</span>
                    </div>
                    <p className="truncate text-sm font-medium text-slate-700 group-hover:text-[#014BAA]">{post.title}</p>
                  </div>
                  <ArrowUpRight size={18} className="shrink-0 text-[#014BAA]/50" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {data.totalPages > 1 && (
            <nav aria-label="내가 쓴 글 페이지" className="flex items-center justify-center gap-5 border-t border-[#014BAA]/10 px-6 py-5 text-sm">
              <button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded border border-[#014BAA]/20 px-3 py-1.5 disabled:opacity-30">이전</button>
              <span aria-live="polite">{page + 1} / {data.totalPages}</span>
              <button type="button" disabled={page + 1 >= data.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded border border-[#014BAA]/20 px-3 py-1.5 disabled:opacity-30">다음</button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
