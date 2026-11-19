import { Moon, Sun } from 'lucide-react';
import { formatHour, type SkyState } from '../../utils/sky';

interface Props {
  sky: SkyState;
  mode: 'auto' | 'manual';
  onChange: (hour: number) => void;
  onReset: () => void;
}

/** 화면 하단 구석의 시간대 미리보기 슬라이더 */
export default function TimeSlider({ sky, mode, onChange, onReset }: Props) {
  const isDay = sky.sun.visible >= sky.moon.visible;
  const Icon = isDay ? Sun : Moon;

  return (
    <div
      className="fixed bottom-4 right-4 z-30 w-[min(calc(100vw-32px),250px)] rounded-md border p-3 shadow-lg backdrop-blur-sm"
      style={{ background: 'var(--field-bg)', borderColor: 'var(--field-border)', color: 'var(--fg)' }}
    >
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5">
          <Icon size={16} aria-hidden="true" color={isDay ? '#f2a516' : '#e8dca8'} />
          <span className="font-bold tabular-nums">{formatHour(sky.hour)}</span>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            {sky.label}
          </span>
        </span>
        <span className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>
          {mode === 'auto' ? '현재 시각' : '미리보기'}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={24}
        step={0.25}
        value={Math.round(sky.hour * 4) / 4}
        onChange={(event) => onChange(Number(event.target.value) % 24)}
        className="fortune-range w-full"
        aria-label="배경 시간대 미리보기"
        aria-valuetext={formatHour(sky.hour)}
      />
      <div className="flex justify-between text-[10px]" style={{ color: 'var(--fg-muted)' }} aria-hidden="true">
        <span>0시</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24시</span>
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={mode === 'auto'}
        className="fortune-ghost-button mt-2 w-full rounded px-2 py-1 text-xs"
      >
        지금 시각으로
      </button>
    </div>
  );
}
