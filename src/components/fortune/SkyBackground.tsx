import { useMemo } from 'react';
import type { SkyState } from '../../utils/sky';

// 원래 색과 실루엣 색을 섞는다
function mix(from: string, to: string, t: number) {
  const parse = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const a = parse(from);
  const b = parse(to);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
}

const STARS = Array.from({ length: 70 }, (_, i) => {
  // 고정된 의사 난수로 매 렌더마다 같은 자리에 뜨게
  const r = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 62, size: 1 + r(3) * 2.2, delay: r(4) * 3, bright: r(5) > 0.8 };
});

const CLOUDS = [
  { top: 12, width: 150, duration: 140, delay: -20 },
  { top: 22, width: 110, duration: 180, delay: -90 },
  { top: 8, width: 90, duration: 200, delay: -150 },
  { top: 30, width: 130, duration: 160, delay: -60 },
];

export default function SkyBackground({ sky }: { sky: SkyState }) {
  const silhouette = sky.silhouette;
  const torii = mix('#c8361d', '#1b1220', silhouette);
  const toriiDark = mix('#2a1a14', '#120b16', silhouette);
  const tree = mix('#3f6b3a', '#0f0d16', silhouette);
  const treeDark = mix('#2e5230', '#0b0a12', silhouette);
  const ground = mix('#b9ad95', '#1d1a24', Math.max(silhouette, sky.stars * 0.8));
  const stone = mix('#9d968a', '#211d28', silhouette);

  const starsVisible = useMemo(() => STARS.filter((star) => star.bright || sky.stars > 0.5), [sky.stars]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 하늘 */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.bottom} 78%)` }} />
      <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{ background: `radial-gradient(120% 70% at 50% 100%, ${sky.glow}, transparent 70%)` }} />

      {/* 별 */}
      <div className="absolute inset-0" style={{ opacity: sky.stars }}>
        {starsVisible.map((star, i) => (
          <span
            key={i}
            className="fortune-star"
            style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>

      {/* 해 */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: `${sky.sun.x}%`,
          top: `${sky.sun.y}%`,
          width: 74,
          height: 74,
          opacity: sky.sun.visible,
          background: 'radial-gradient(circle, #fff7d6 0%, #ffd56b 45%, #ffb347 70%)',
          boxShadow: '0 0 60px 24px rgba(255, 210, 120, 0.45)',
        }}
      />

      {/* 달 */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: `${sky.moon.x}%`,
          top: `${sky.moon.y}%`,
          width: 56,
          height: 56,
          opacity: sky.moon.visible,
          background: 'radial-gradient(circle at 38% 35%, #fffdf0, #efe6c4 60%, #d9cfa6)',
          boxShadow: '0 0 40px 12px rgba(255, 248, 220, 0.3), inset -8px -6px 0 rgba(180, 170, 130, 0.25)',
        }}
      />

      {/* 구름 */}
      <div className="absolute inset-0" style={{ opacity: sky.clouds }}>
        {CLOUDS.map((cloud, i) => (
          <span
            key={i}
            className="fortune-cloud"
            style={{ top: `${cloud.top}%`, left: 0, width: cloud.width, animationDuration: `${cloud.duration}s`, animationDelay: `${cloud.delay}s` }}
          />
        ))}
      </div>

      {/* 도리이 · 나무 · 등롱 */}
      <svg className="absolute bottom-0 left-1/2 w-[max(100%,820px)] max-w-[1500px] -translate-x-1/2" viewBox="0 0 1200 600">
        {/* 나무 */}
        <g fill={treeDark}>
          <ellipse cx="70" cy="420" rx="130" ry="170" />
          <ellipse cx="1140" cy="410" rx="140" ry="180" />
        </g>
        <g fill={tree}>
          <ellipse cx="160" cy="470" rx="110" ry="120" />
          <ellipse cx="20" cy="500" rx="100" ry="110" />
          <ellipse cx="1050" cy="470" rx="115" ry="125" />
          <ellipse cx="1190" cy="500" rx="100" ry="110" />
        </g>

        {/* 도리이 */}
        <g>
          <path d="M300 128 Q600 96 900 128 L912 106 Q600 70 288 106 Z" fill={toriiDark} />
          <path d="M318 150 Q600 122 882 150 L888 128 Q600 98 312 128 Z" fill={torii} />
          <rect x="350" y="206" width="500" height="22" fill={torii} />
          <rect x="584" y="150" width="32" height="58" fill={torii} />
          <rect x="388" y="146" width="38" height="454" fill={torii} />
          <rect x="774" y="146" width="38" height="454" fill={torii} />
          <rect x="380" y="560" width="54" height="40" fill={toriiDark} />
          <rect x="766" y="560" width="54" height="40" fill={toriiDark} />
        </g>

        {/* 땅 */}
        <path d="M0 560 Q600 536 1200 560 L1200 600 L0 600 Z" fill={ground} />

        {/* 석등롱 */}
        {[230, 970].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <rect x="-10" y="490" width="20" height="78" fill={stone} />
            <rect x="-30" y="560" width="60" height="12" fill={stone} />
            <rect x="-26" y="476" width="52" height="14" fill={stone} />
            <rect x="-20" y="436" width="40" height="40" fill={stone} />
            <g style={{ opacity: sky.lanterns }}>
              <circle cx="0" cy="456" r="46" fill="rgba(255, 170, 70, 0.28)" className="fortune-lantern-fire" />
              <rect x="-11" y="443" width="22" height="26" fill="#ffc768" className="fortune-lantern-fire" />
            </g>
            <path d="M-38 438 L0 410 L38 438 Z" fill={stone} />
            <circle cx="0" cy="404" r="6" fill={stone} />
          </g>
        ))}
      </svg>
    </div>
  );
}
