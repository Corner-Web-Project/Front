import { GRADES, type FortuneResult, type FortuneStatsResponse } from '../../types/fortune';

interface Props {
  stats?: FortuneStatsResponse;
  error?: Error;
  /** 방금 뽑은 결과일 때만 "몇 번째" 문구를 보여준다 */
  result?: FortuneResult;
  onRetry: () => void;
}

export default function FortuneStatsPanel({ stats, error, result, onRetry }: Props) {
  return (
    <section
      className="fortune-fade-in w-[min(92vw,440px)] rounded-sm border border-[var(--gold)] bg-[rgba(251,246,233,0.92)] p-4 text-[var(--ink)] shadow-lg"
      aria-label="오늘의 운세 통계"
    >
      {result && (
        <p className="mb-3 text-center text-[15px] font-bold">
          오늘 <span className="text-[var(--vermilion)]">{result.grade}</span>을 뽑은 사람 중{' '}
          <span className="text-[var(--vermilion)]">{result.gradeRank}번째</span>예요!
        </p>
      )}

      {error && (
        <div className="text-center text-sm">
          <p>{error.message}</p>
          <button type="button" onClick={onRetry} className="mt-2 underline underline-offset-2">
            다시 불러오기
          </button>
        </div>
      )}

      {!error && !stats && <p className="text-center text-sm text-[rgba(31,21,16,0.6)]">통계를 불러오는 중…</p>}

      {stats && (
        <>
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-sm font-bold">오늘의 통계</h3>
            <span className="text-sm">
              오늘 <strong className="text-[var(--vermilion)]">{stats.today.total.toLocaleString()}</strong>명이 뽑았어요
            </span>
          </div>
          <ul className="space-y-1">
            {GRADES.map((grade) => {
              const count = stats.today.byGrade[grade] ?? 0;
              const ratio = stats.today.total ? count / stats.today.total : 0;
              return (
                <li key={grade} className="flex items-center gap-2 text-[13px]">
                  <span className={`w-9 shrink-0 font-bold ${grade === result?.grade ? 'text-[var(--vermilion)]' : ''}`}>{grade}</span>
                  <span className="h-[10px] flex-1 overflow-hidden rounded-full bg-[rgba(200,54,29,0.1)]">
                    <span
                      className="block h-full rounded-full bg-[var(--vermilion)] transition-[width] duration-700"
                      style={{ width: `${ratio * 100}%`, opacity: grade === result?.grade ? 1 : 0.55 }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right tabular-nums">{count}명</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-dashed border-[rgba(200,54,29,0.35)] pt-2 text-[11px] text-[rgba(31,21,16,0.65)]">
            누적 {stats.cumulative.total.toLocaleString()}명 ·{' '}
            {GRADES.map((grade) => `${grade} ${stats.cumulative.byGrade[grade] ?? 0}`).join(' · ')}
          </p>
        </>
      )}
    </section>
  );
}
