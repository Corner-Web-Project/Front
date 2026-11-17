import type { FortuneResult } from '../../types/fortune';

interface FortunePaperProps {
  result: FortuneResult;
  /** true면 접힌 종이가 펼쳐지는 연출을 재생 */
  animate: boolean;
}

function Strip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="fortune-strip fortune-vertical">
      <span className="fortune-strip-label">{label}</span>
      <span className="fortune-strip-value">
        {typeof value === 'number' ? <span className="fortune-tcy">{value}</span> : value}
      </span>
    </div>
  );
}

const formatDate = (date: string) => {
  const [y, m, d] = date.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
};

export default function FortunePaper({ result, animate }: FortunePaperProps) {
  const { lucky } = result;
  const isGreat = result.grade === '대길';

  // 실제 오미쿠지처럼 오른쪽부터 읽히도록 세로 칸을 배치
  const right = [
    { label: '행운의 색', value: lucky.color },
    { label: '행운의 아이템', value: lucky.item },
    { label: '행운의 음식', value: lucky.food },
    { label: '행운의 장소', value: lucky.place },
  ];
  const left = [
    { label: '행운의 시간', value: lucky.time },
    { label: '행운의 방향', value: lucky.direction },
    { label: '행운의 키워드', value: lucky.keyword },
    { label: '행운의 숫자', value: lucky.number },
  ];

  return (
    <article className={`fortune-paper ${animate ? 'is-unfolding' : ''}`} aria-label={`${result.name}님의 오늘의 운세: ${result.grade}`}>
      <div className="fortune-paper-frame">
        {/* 상단 장식 */}
        <header className="relative mb-2 flex items-center justify-between border-b-2 border-[var(--vermilion)] pb-2">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--vermilion)]">
            第<span className="mx-0.5">{result.stickNumber}</span>番
          </span>
          <span className="flex items-center gap-2 text-[15px] font-bold tracking-[0.5em] text-[var(--vermilion)]">
            <svg width="22" height="16" viewBox="0 0 44 32" aria-hidden="true">
              <path d="M2 6 Q22 0 42 6 L42 9 Q22 3 2 9 Z M6 12 H38 V15 H6 Z M10 8 H14 V32 H10 Z M30 8 H34 V32 H30 Z" fill="currentColor" />
            </svg>
            御神籤
          </span>
          <span className="text-[11px] tracking-wider text-[var(--vermilion)]">오늘의 운세</span>
        </header>
        <div
          className="mb-3 h-[10px]"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 10px -2px, transparent 7px, var(--vermilion) 7.5px, var(--vermilion) 8.5px, transparent 9px) 0 0 / 20px 10px repeat-x',
            opacity: 0.6,
          }}
        />

        {/* 본문: 좌우 세로 칸 + 가운데 등급 */}
        <div className="flex items-stretch justify-center border-y border-[rgba(200,54,29,0.45)]" style={{ minHeight: 230 }}>
          <div className="flex flex-1 flex-row-reverse">
            {left.map((item) => (
              <Strip key={item.label} {...item} />
            ))}
          </div>
          <div className="flex w-[118px] shrink-0 flex-col items-center justify-center border-x-2 border-[var(--vermilion)] py-3">
            <span
              className="fortune-brush fortune-vertical leading-none"
              style={{ fontSize: 108, color: isGreat ? 'var(--vermilion)' : 'var(--ink)' }}
            >
              {result.grade}
            </span>
          </div>
          <div className="flex flex-1 flex-row-reverse">
            {right.map((item) => (
              <Strip key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* 총운 · 한마디 */}
        <section className="mt-4 space-y-3 text-center">
          <p className="text-[11px] font-bold tracking-[0.3em] text-[var(--vermilion)]">― 총운 ―</p>
          <p className="break-keep px-2 text-[16px] font-bold leading-relaxed">{result.summary}</p>
          <p className="break-keep border-y border-dashed border-[rgba(200,54,29,0.4)] px-2 py-2 text-[14px] leading-relaxed">
            {result.message}
          </p>
        </section>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
          <div className="border border-[rgba(200,54,29,0.4)] p-2">
            <dt className="text-[11px] font-bold text-[var(--vermilion)]">조심할 것</dt>
            <dd className="mt-1 break-keep">{result.caution}</dd>
          </div>
          <div className="border border-[rgba(200,54,29,0.4)] p-2">
            <dt className="text-[11px] font-bold text-[var(--vermilion)]">오늘의 미션</dt>
            <dd className="mt-1 break-keep">{result.mission}</dd>
          </div>
        </dl>

        <footer className="mt-3 flex items-center justify-between text-[11px] text-[rgba(31,21,16,0.7)]">
          <span>{result.name} 님</span>
          <span>{formatDate(result.date)}</span>
        </footer>
      </div>

      {result.grade === '흉' && (
        <div className={`fortune-stamp ${animate ? 'is-animated' : ''}`} role="img" aria-label="액땜 도장">
          액땜
        </div>
      )}
    </article>
  );
}
