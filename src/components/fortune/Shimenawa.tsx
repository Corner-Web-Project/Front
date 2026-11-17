// 상단 장식: 시메나와(금줄)와 시데(지그재그 종이 장식)

const SHIDE_POSITIONS = [14, 38, 62, 86];

function Shide({ left }: { left: number }) {
  return (
    <svg
      className="fortune-shide absolute h-[64px] w-[24px] -translate-x-1/2"
      // 줄이 아래로 처진 곡선(아래 테두리 y = 22 + 80t(1-t))에 맞춰 매단다
      style={{ left: `${left}%`, top: 18 + 80 * (left / 100) * (1 - left / 100), animationDelay: `${left * -0.05}s` }}
      viewBox="0 0 24 64"
    >
      <path
        d="M10 0 H14 V10 H22 V26 H6 V38 H20 V52 H8 V64 H2 V48 H14 V42 H2 V20 H16 V16 H10 Z"
        fill="#fffdf6"
        stroke="#d8cfb6"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export default function Shimenawa() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[100px]" aria-hidden="true">
      <svg className="absolute inset-x-0 top-0 h-[44px] w-full" viewBox="0 0 1000 44" preserveAspectRatio="none">
        <defs>
          <linearGradient id="shimenawa-rope" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3dd9a" />
            <stop offset="0.5" stopColor="#c9a24a" />
            <stop offset="1" stopColor="#8a6620" />
          </linearGradient>
          <pattern id="shimenawa-twist" width="26" height="44" patternUnits="userSpaceOnUse">
            <path d="M0 6 L26 38" stroke="rgba(110, 76, 18, 0.45)" strokeWidth="3" />
          </pattern>
        </defs>
        <path d="M0 6 Q500 46 1000 6 L1000 22 Q500 62 0 22 Z" fill="url(#shimenawa-rope)" />
        <path d="M0 6 Q500 46 1000 6 L1000 22 Q500 62 0 22 Z" fill="url(#shimenawa-twist)" />
      </svg>
      {SHIDE_POSITIONS.map((left) => (
        <Shide key={left} left={left} />
      ))}
    </div>
  );
}
