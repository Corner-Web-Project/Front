import { useCallback, useEffect, useRef, useState } from 'react';
import { currentHour, hourDelta, wrapHour } from '../utils/sky';

const CHECK_INTERVAL = 60_000;
const TWEEN_MS = 1800;

/**
 * 배경에 쓸 시각을 관리한다.
 * - auto: 현재 시각에서 시작해 1분마다 확인하고, 바뀐 시각까지 천천히 이동
 * - manual: 슬라이더 값을 그대로 따름 (자동 변화 정지)
 * - resetToNow(): 현재 시각으로 부드럽게 돌아가 다시 auto
 */
export function useSkyClock() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [hour, setHour] = useState(currentHour);
  const hourRef = useRef(hour);
  const frameRef = useRef<number | null>(null);

  const apply = useCallback((value: number) => {
    hourRef.current = value;
    setHour(value);
  }, []);

  const cancelTween = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  };

  const tweenTo = useCallback(
    (target: number) => {
      cancelTween();
      const from = hourRef.current;
      const delta = hourDelta(from, target);
      if (Math.abs(delta) < 0.001) return;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const duration = reduce ? 0 : TWEEN_MS;
      const start = performance.now();
      const step = (now: number) => {
        const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        apply(wrapHour(from + delta * eased));
        frameRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [apply],
  );

  useEffect(() => {
    if (mode !== 'auto') return;
    const timer = setInterval(() => tweenTo(currentHour()), CHECK_INTERVAL);
    return () => clearInterval(timer);
  }, [mode, tweenTo]);

  useEffect(() => cancelTween, []);

  const setManualHour = useCallback(
    (value: number) => {
      cancelTween();
      setMode('manual');
      apply(value);
    },
    [apply],
  );

  const resetToNow = useCallback(() => {
    setMode('auto');
    tweenTo(currentHour());
  }, [tweenTo]);

  return { hour, mode, setManualHour, resetToNow };
}
