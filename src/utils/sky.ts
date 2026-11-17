// 시각(0~24, 소수 허용)에 따른 하늘 상태를 계산한다. 키프레임 사이 값은 선형 보간한다.

type RGB = [number, number, number];

interface SkyKeyframe {
  hour: number;
  top: RGB;
  bottom: RGB;
  /** 지평선 빛 (새벽·노을) */
  glow: RGB;
  glowAlpha: number;
  stars: number;
  clouds: number;
  /** 도리이·나무가 실루엣이 되는 정도 (0: 원래 색, 1: 검은 실루엣) */
  silhouette: number;
  lanterns: number;
}

const hex = (value: string): RGB => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)) as RGB;

const KEYFRAMES: SkyKeyframe[] = [
  { hour: 0, top: hex('#060b24'), bottom: hex('#18224a'), glow: hex('#2a3570'), glowAlpha: 0, stars: 1, clouds: 0, silhouette: 0.85, lanterns: 1 },
  { hour: 4, top: hex('#0b1033'), bottom: hex('#2a2a5e'), glow: hex('#6a5a9e'), glowAlpha: 0.1, stars: 0.8, clouds: 0, silhouette: 0.85, lanterns: 1 },
  { hour: 5.2, top: hex('#232a6b'), bottom: hex('#7a5a9a'), glow: hex('#f2a6a0'), glowAlpha: 0.45, stars: 0.35, clouds: 0.1, silhouette: 0.7, lanterns: 0.5 },
  { hour: 6.3, top: hex('#8fc6ea'), bottom: hex('#f5dcc0'), glow: hex('#ffd59a'), glowAlpha: 0.35, stars: 0, clouds: 0.4, silhouette: 0.2, lanterns: 0 },
  { hour: 9, top: hex('#8ccbf0'), bottom: hex('#d8eefb'), glow: hex('#ffffff'), glowAlpha: 0.1, stars: 0, clouds: 0.6, silhouette: 0, lanterns: 0 },
  { hour: 12, top: hex('#3d9be6'), bottom: hex('#b6e0fa'), glow: hex('#ffffff'), glowAlpha: 0.1, stars: 0, clouds: 1, silhouette: 0, lanterns: 0 },
  { hour: 15.5, top: hex('#4fa3e0'), bottom: hex('#cbe6f6'), glow: hex('#fff4d6'), glowAlpha: 0.15, stars: 0, clouds: 0.9, silhouette: 0, lanterns: 0 },
  { hour: 17.2, top: hex('#e9805f'), bottom: hex('#f9c38f'), glow: hex('#ff9a6a'), glowAlpha: 0.55, stars: 0, clouds: 0.5, silhouette: 0.8, lanterns: 0.2 },
  { hour: 18.4, top: hex('#6b4a8e'), bottom: hex('#f08aa0'), glow: hex('#ff7e7e'), glowAlpha: 0.5, stars: 0.15, clouds: 0.25, silhouette: 0.9, lanterns: 0.6 },
  { hour: 19.5, top: hex('#141a45'), bottom: hex('#3a3468'), glow: hex('#6a4a8a'), glowAlpha: 0.15, stars: 0.75, clouds: 0, silhouette: 0.85, lanterns: 1 },
  { hour: 24, top: hex('#060b24'), bottom: hex('#18224a'), glow: hex('#2a3570'), glowAlpha: 0, stars: 1, clouds: 0, silhouette: 0.85, lanterns: 1 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRgb = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const rgb = (c: RGB, alpha = 1) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${alpha})`;

/** 0~24 범위로 정규화 */
export const wrapHour = (hour: number) => ((hour % 24) + 24) % 24;

export interface SkyState {
  hour: number;
  top: string;
  bottom: string;
  glow: string;
  stars: number;
  clouds: number;
  silhouette: number;
  lanterns: number;
  /** 화면 기준 위치(%)와 보임 정도 */
  sun: { x: number; y: number; visible: number };
  moon: { x: number; y: number; visible: number };
  /** 배경이 밝으면 true → 어두운 글자 사용 */
  isLight: boolean;
  label: '새벽' | '아침' | '낮' | '저녁' | '밤';
}

const relativeLuminance = ([r, g, b]: RGB) => {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** 해/달이 start~end 시각 동안 왼쪽에서 오른쪽으로 호를 그리며 움직인다 */
function arc(hour: number, start: number, end: number) {
  const span = wrapHour(end - start);
  const progress = wrapHour(hour - start) / span;
  if (progress > 1) return { x: progress < 1.5 ? 105 : -5, y: 80, visible: 0 };
  const x = 8 + progress * 84;
  const y = 72 - Math.sin(progress * Math.PI) * 58;
  const edge = Math.min(progress, 1 - progress);
  return { x, y, visible: Math.min(1, edge * 10) };
}

export function skyAt(rawHour: number): SkyState {
  const hour = wrapHour(rawHour);
  const index = KEYFRAMES.findIndex((frame) => frame.hour > hour);
  const b = KEYFRAMES[index === -1 ? KEYFRAMES.length - 1 : index];
  const a = KEYFRAMES[Math.max(0, (index === -1 ? KEYFRAMES.length : index) - 1)];
  const t = b.hour === a.hour ? 0 : (hour - a.hour) / (b.hour - a.hour);

  const top = lerpRgb(a.top, b.top, t);
  const bottom = lerpRgb(a.bottom, b.bottom, t);
  const middle = lerpRgb(top, bottom, 0.6);

  const label =
    hour >= 4 && hour < 6 ? '새벽' : hour >= 6 && hour < 11 ? '아침' : hour >= 11 && hour < 16 ? '낮' : hour >= 16 && hour < 19 ? '저녁' : '밤';

  return {
    hour,
    top: rgb(top),
    bottom: rgb(bottom),
    glow: rgb(lerpRgb(a.glow, b.glow, t), lerp(a.glowAlpha, b.glowAlpha, t)),
    stars: lerp(a.stars, b.stars, t),
    clouds: lerp(a.clouds, b.clouds, t),
    silhouette: lerp(a.silhouette, b.silhouette, t),
    lanterns: lerp(a.lanterns, b.lanterns, t),
    sun: arc(hour, 5.8, 18.8),
    moon: arc(hour, 18.6, 6),
    isLight: relativeLuminance(middle) > 0.32,
    label,
  };
}

export function formatHour(hour: number) {
  const total = Math.round(wrapHour(hour) * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export const currentHour = (now: Date = new Date()) => now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

/** 시계 방향으로 가장 짧은 차이 (-12 ~ 12) */
export const hourDelta = (from: number, to: number) => {
  const d = wrapHour(to - from);
  return d > 12 ? d - 24 : d;
};
