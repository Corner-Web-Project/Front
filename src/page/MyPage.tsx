import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight, CalendarDays, FolderOpen, UserRound } from 'lucide-react';
import { getMyMember, type Member } from '../api/member';
import { useAuth } from '../context/auth';
import MyPosts from '../components/MyPosts';
import OmikujiIcon from '../components/fortune/OmikujiIcon';

function formatJoinDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '정보 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
  }).format(date);
}

export default function MyPage() {
  useAuth();
  const accessToken = localStorage.getItem('accessToken');
  return <MyPageContent key={accessToken || 'guest'} accessToken={accessToken} />;
}

function MyPageContent({ accessToken }: { accessToken: string | null }) {
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    getMyMember(accessToken, controller.signal).then(
      (data) => { if (!controller.signal.aborted) setMember(data); },
      () => {
        if (!controller.signal.aborted) setError('내 정보를 불러오지 못했습니다. 로그인 상태와 서버 연결을 확인해 주세요.');
      },
    );
    return () => controller.abort();
  }, [accessToken, attempt]);

  return (
    <section className="min-h-[calc(100vh-80px)] px-6 py-14 text-[#014BAA] md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#014BAA]/60 transition hover:text-[#014BAA]">
          <ArrowLeft size={16} aria-hidden="true" />홈으로
        </Link>
        <div className="mb-8 border-b border-[#014BAA]/15 pb-7">
          <p className="mb-3 text-xs tracking-[0.25em] text-[#014BAA]/50">MY PAGE</p>
          <h1 className="text-3xl font-semibold md:text-4xl">마이페이지</h1>
          <p className="mt-3 text-sm text-slate-500">구석방에 등록된 내 정보를 확인해 보세요.</p>
        </div>

        {!accessToken ? (
          <div className="rounded-2xl border border-[#014BAA]/15 bg-white p-10 text-center">
            <h2 className="text-xl font-medium">로그인이 필요합니다.</h2>
            <p className="mt-3 text-sm text-slate-500">로그인하면 내 회원 정보를 확인할 수 있어요.</p>
            <Link to="/SignIn" className="mt-6 inline-block rounded-lg bg-[#014BAA] px-6 py-3 text-sm text-white">로그인하기</Link>
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-[#014BAA]/15 bg-white p-8">
            <p className="text-sm text-slate-600">{error}</p>
            <button type="button" onClick={() => { setError(''); setMember(null); setAttempt((value) => value + 1); }} className="mt-5 rounded-lg border border-[#014BAA] px-4 py-2 text-sm hover:bg-[#014BAA]/5">다시 시도</button>
            <Link to="/SignIn" className="ml-4 text-sm underline underline-offset-4">로그인하기</Link>
          </div>
        ) : !member ? (
          <div role="status" className="rounded-2xl border border-[#014BAA]/15 bg-white p-10 text-center text-sm text-slate-500">내 정보를 불러오는 중입니다.</div>
        ) : (
          <>
          <div className="overflow-hidden rounded-2xl border border-[#014BAA]/15 bg-white shadow-[0_12px_40px_rgba(1,75,170,0.04)]">
            <div className="flex flex-wrap items-center gap-5 bg-[#BDDAFF]/30 px-6 py-8 md:px-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#014BAA]/15 bg-white text-[#014BAA]">
                <UserRound size={28} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words text-2xl font-semibold">{member.name}<span className="ml-1 text-lg font-normal">님</span></p>
                <p className="mt-1 text-sm text-slate-500">반가워요. 오늘도 구석방과 함께해요.</p>
              </div>
              <span className="rounded-full border border-[#014BAA]/20 bg-white px-3 py-1 text-xs font-medium">{member.role === 'ADMIN' ? '운영진' : '일반 회원'}</span>
            </div>
            <div className="px-6 py-8 md:px-10">
              <h2 className="mb-2 text-lg font-semibold">기본 정보</h2>
              <dl className="divide-y divide-[#014BAA]/10">
                {[
                  ['이름', member.name],
                  ['아이디 (학번)', member.studentId],
                  ['회원 구분', member.role === 'ADMIN' ? '운영진' : '일반 회원'],
                  ['가입일', formatJoinDate(member.createDate)],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-5 text-sm sm:grid-cols-[140px_1fr] sm:gap-6">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="break-words font-medium text-slate-700">{value || '정보 없음'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <MyPosts key={accessToken} accessToken={accessToken} />
          <section className="mt-8" aria-labelledby="mypage-shortcuts">
            <h2 id="mypage-shortcuts" className="mb-4 text-lg font-semibold">구석방 바로가기</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { to: '/Schedule', title: '동아리 일정', description: '다가오는 활동 확인하기', icon: CalendarDays },
                { to: '/Project', title: '프로젝트', description: '함께 만든 프로젝트 둘러보기', icon: FolderOpen },
                { to: '/Fortune', title: '오늘의 운세', description: '오늘 나의 운세 뽑아보기', icon: OmikujiIcon },
              ].map(({ to, title, description, icon: Icon }) => (
                <Link key={to} to={to} className="rounded-xl border border-[#014BAA]/15 bg-white p-5 transition hover:border-[#014BAA]/40 hover:bg-[#BDDAFF]/15">
                  <div className="mb-5 flex items-center justify-between"><Icon size={20} strokeWidth={1.5} aria-hidden="true" /><ArrowUpRight size={16} aria-hidden="true" /></div>
                  <h3 className="text-sm font-medium">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
                </Link>
              ))}
            </div>
          </section>
          </>
        )}
      </div>
    </section>
  );
}
