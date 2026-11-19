import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { drawFortune, getFortune, getFortuneStats } from '../api/fortune';
import FortunePaper from '../components/fortune/FortunePaper';
import FortuneStatsPanel from '../components/fortune/FortuneStatsPanel';
import OmikujiBox from '../components/fortune/OmikujiBox';
import SakuraPetals from '../components/fortune/SakuraPetals';
import Shimenawa from '../components/fortune/Shimenawa';
import SkyBackground from '../components/fortune/SkyBackground';
import TimeSlider from '../components/fortune/TimeSlider';
import { useApiQuery } from '../hooks/useApiQuery';
import { useSkyClock } from '../hooks/useSkyClock';
import type { FortuneResult } from '../types/fortune';
import { playFortuneSound } from '../utils/fortuneSound';
import { skyAt } from '../utils/sky';
import '../css/fortune.css';

type Phase = 'idle' | 'shaking' | 'stick' | 'stickLeaving' | 'paper';

const MAX_NAME = 20;
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, reducedMotion() ? Math.min(ms, 250) : ms));

export default function Fortune() {
  const { id: sharedId } = useParams();
  const navigate = useNavigate();
  const clock = useSkyClock();
  const sky = skyAt(clock.hour);

  return (
    <div className="fortune relative min-h-[calc(100vh-80px)] overflow-hidden" data-sky={sky.isLight ? 'light' : 'dark'}>
      <SkyBackground sky={sky} />
      <Shimenawa lanternLight={sky.lanterns} />
      <div className="relative z-10 flex flex-col items-center px-4 pb-40 pt-28" style={{ color: 'var(--fg)' }}>
        {sharedId ? (
          <SharedResult key={sharedId} id={sharedId} onDrawAgain={() => navigate('/Fortune')} />
        ) : (
          <DrawFlow />
        )}
      </div>
      <TimeSlider sky={sky} mode={clock.mode} onChange={clock.setManualHour} onReset={clock.resetToNow} />
    </div>
  );
}

function Title({ sub }: { sub: string }) {
  return (
    <header className="fortune-on-sky mb-8 text-center">
      <h1 className="fortune-brush text-[56px] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">오늘의 오미쿠지</h1>
      <p className="mt-3 text-sm" style={{ color: 'var(--fg-muted)' }}>
        {sub}
      </p>
    </header>
  );
}

function useStats(enabled: boolean) {
  const load = useCallback((signal: AbortSignal) => getFortuneStats(signal), []);
  const noop = useCallback(() => new Promise<never>(() => {}), []);
  return useApiQuery(enabled ? load : noop);
}

function DrawFlow() {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState('');
  const [statsKey, setStatsKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const running = useRef(false);

  const statsLoader = useCallback(
    (signal: AbortSignal) => (statsKey === 0 ? new Promise<never>(() => {}) : getFortuneStats(signal)),
    [statsKey],
  );
  const stats = useApiQuery(statsLoader);

  const start = async () => {
    if (running.current) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError('이름을 입력하고 통을 흔들어주세요.');
      inputRef.current?.focus();
      return;
    }
    running.current = true;
    setError('');
    setPhase('shaking');
    playFortuneSound('shake');
    try {
      const [drawn] = await Promise.all([drawFortune(trimmed), wait(1650)]);
      setResult(drawn);
      setPhase('stick');
      playFortuneSound('stick');
      await wait(1700);
      setPhase('stickLeaving');
      await wait(450);
      setPhase('paper');
      playFortuneSound('unfold');
      if (drawn.grade === '대길') playFortuneSound('great');
      if (drawn.grade === '흉') playFortuneSound('bad');
      setStatsKey((key) => key + 1);
    } catch (caught) {
      setPhase('idle');
      setError(caught instanceof Error ? caught.message : '운세를 뽑지 못했습니다.');
    } finally {
      running.current = false;
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void start();
  };

  const reset = () => {
    setPhase('idle');
    setResult(null);
    setName('');
    setStatsKey(0);
    setTimeout(() => inputRef.current?.focus());
  };

  if (phase === 'paper' && result) {
    return (
      <>
        {result.grade === '대길' && <SakuraPetals />}
        <Title sub={`${result.name} 님의 오늘의 운세`} />
        <FortunePaper result={result} animate />
        <div className="mt-6 flex flex-col items-center gap-5">
          <ShareBar result={result} />
          <FortuneStatsPanel stats={stats.data} error={stats.error} result={result} onRetry={stats.retry} />
          <button type="button" onClick={reset} className="fortune-ghost-button rounded px-4 py-2 text-sm">
            다른 이름으로 뽑기
          </button>
        </div>
      </>
    );
  }

  const busy = phase !== 'idle';
  return (
    <>
      <Title sub="이름을 적고 오미쿠지 통을 흔들어 보세요. 같은 이름은 하루 동안 같은 운세가 나와요." />
      <form onSubmit={onSubmit} className="mb-10 flex w-[min(92vw,360px)] flex-col items-center gap-2">
        <label htmlFor="fortune-name" className="fortune-on-sky text-sm font-bold">
          이름
        </label>
        <div className="flex w-full gap-2">
          <input
            id="fortune-name"
            ref={inputRef}
            value={name}
            maxLength={MAX_NAME}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
            placeholder="이름을 입력하세요"
            autoComplete="off"
            className="min-w-0 flex-1 rounded border px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[var(--gold)]"
            style={{ background: 'var(--field-bg)', borderColor: 'var(--field-border)', color: 'var(--fg)' }}
          />
          <button type="submit" disabled={busy} className="fortune-button rounded px-4 py-2 text-[15px] font-bold">
            흔들기
          </button>
        </div>
        <p className="min-h-[1.5em] text-sm font-bold" role="alert">
          {error && <span className="rounded bg-[rgba(158,36,20,0.9)] px-2 py-0.5 text-[#fffaf0]">{error}</span>}
        </p>
      </form>

      <div className="flex h-[300px] items-end justify-center">
        <OmikujiBox
          shaking={phase === 'shaking'}
          stick={phase === 'stick' ? 'rising' : phase === 'stickLeaving' ? 'leaving' : 'hidden'}
          stickNumber={result?.stickNumber}
          disabled={busy}
          onShake={() => void start()}
        />
      </div>
      <p className="fortune-on-sky mt-4 text-sm font-bold" aria-live="polite">
        {phase === 'shaking' ? '달그락달그락…' : phase === 'stick' || phase === 'stickLeaving' ? `${result?.stickNumber}번 막대가 나왔어요!` : '통을 눌러도 흔들 수 있어요'}
      </p>
    </>
  );
}

function ShareBar({ result }: { result: FortuneResult }) {
  const [copied, setCopied] = useState<'idle' | 'done' | 'fail'>('idle');
  const url = `${window.location.origin}/Fortune/result/${result.id}`;

  useEffect(() => {
    if (copied === 'idle') return;
    const timer = setTimeout(() => setCopied('idle'), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied('done');
    } catch {
      setCopied('fail');
    }
  };

  return (
    <div className="flex w-[min(92vw,440px)] flex-col items-center gap-2">
      <button type="button" onClick={copy} className="fortune-button rounded px-5 py-2 text-sm font-bold">
        {copied === 'done' ? '링크를 복사했어요' : '결과 링크 복사하기'}
      </button>
      {copied === 'fail' && (
        <input
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className="w-full rounded border px-2 py-1 text-xs"
          style={{ background: 'var(--field-bg)', borderColor: 'var(--field-border)', color: 'var(--fg)' }}
          aria-label="공유 링크"
        />
      )}
    </div>
  );
}

function SharedResult({ id, onDrawAgain }: { id: string; onDrawAgain: () => void }) {
  const loadResult = useCallback((signal: AbortSignal) => getFortune(id, signal), [id]);
  const query = useApiQuery(loadResult);
  const stats = useStats(Boolean(query.data));

  if (query.loading) {
    return <p className="fortune-on-sky mt-20 text-sm">운세 종이를 찾는 중…</p>;
  }

  if (query.error || !query.data) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Title sub={query.error ? query.error.message : '이 링크의 운세를 찾을 수 없어요.'} />
        {query.error && (
          <button type="button" onClick={query.retry} className="fortune-ghost-button rounded px-4 py-2 text-sm">
            다시 시도
          </button>
        )}
        <Link to="/Fortune" className="fortune-button rounded px-5 py-2 text-sm font-bold">
          나도 뽑아보기
        </Link>
      </div>
    );
  }

  const result = query.data;
  return (
    <>
      {result.grade === '대길' && <SakuraPetals />}
      <Title sub={`${result.name} 님이 뽑은 오늘의 운세`} />
      <FortunePaper result={result} animate={false} />
      <div className="mt-6 flex flex-col items-center gap-5">
        <button type="button" onClick={onDrawAgain} className="fortune-button rounded px-6 py-2.5 text-[15px] font-bold">
          나도 뽑아보기
        </button>
        <FortuneStatsPanel stats={stats.data} error={stats.error} onRetry={stats.retry} />
      </div>
    </>
  );
}
