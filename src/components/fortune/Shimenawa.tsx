// 상단 장식: 시메나와(금줄)에 매달린 소원등(종이 등롱)
// 등은 움직이지 않고, 밤이 될수록 켜지며 불빛 밝기만 천천히 오르내린다.

interface LanternSpec {
  left: number;
  /** 등 몸통 색 */
  body: 'red' | 'cream';
  /** 작은 화면에서는 가운데 두 개를 숨겨 제목과 겹치지 않게 */
  wideOnly?: boolean;
}

const LANTERNS: LanternSpec[] = [
  { left: 12, body: 'red' },
  { left: 36, body: 'cream', wideOnly: true },
  { left: 64, body: 'cream', wideOnly: true },
  { left: 88, body: 'red' },
];

const PALETTE = {
  red: { light: '#e2553a', base: '#b92d17', dark: '#6e1609', lit: '#ffb36b', text: '#1d1210' },
  cream: { light: '#fffaf0', base: '#efe3c4', dark: '#a8946a', lit: '#fff0c2', text: '#b92d17' },
};

// 등 몸통(타원) 위의 대나무 살: 각 높이에서 타원 폭에 맞는 가로 곡선
const RIBS = [26, 33, 40, 47, 54, 61, 68, 74].map((y) => {
  const half = 22 * Math.sqrt(Math.max(0, 1 - ((y - 48) / 29) ** 2));
  return `M${30 - half} ${y} Q30 ${y + 3.5} ${30 + half} ${y}`;
});

/** 줄이 아래로 처진 곡선(아래 테두리 y = 22 + 80t(1-t))에 맞춰 매단다 */
const ropeBottom = (left: number) => 18 + 80 * (left / 100) * (1 - left / 100);

function WishLantern({ spec, index, lit }: { spec: LanternSpec; index: number; lit: number }) {
  const c = PALETTE[spec.body];
  const shade = `lantern-shade-${index}`;
  const glow = `lantern-glow-${index}`;
  const halo = `lantern-halo-${index}`;

  return (
    <svg
      className={`absolute h-[118px] w-[71px] -translate-x-1/2 ${spec.wideOnly ? 'hidden sm:block' : ''}`}
      style={{ left: `${spec.left}%`, top: ropeBottom(spec.left) - 4 }}
      viewBox="0 0 60 100"
    >
      <defs>
        {/* 원통처럼 보이도록 좌우 음영 */}
        <linearGradient id={shade} x1="0" x2="1">
          <stop offset="0" stopColor={c.dark} />
          <stop offset="0.35" stopColor={c.light} />
          <stop offset="0.6" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <radialGradient id={halo}>
          <stop offset="0" stopColor="#ffc778" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffc778" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" />
          <stop offset="0.55" stopColor={c.lit} stopOpacity="0.7" />
          <stop offset="1" stopColor={c.lit} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 끈 */}
      <path d="M30 0 V13" stroke="#3a2a18" strokeWidth="1.4" />

      {/* 켜졌을 때 주변으로 번지는 빛 */}
      <g style={{ opacity: lit }}>
        <circle cx="30" cy="48" r="30" fill={`url(#${halo})`} className="fortune-lantern-fire" />
      </g>

      {/* 몸통 */}
      <ellipse cx="30" cy="48" rx="22" ry="29" fill={`url(#${shade})`} />
      <g style={{ opacity: lit }}>
        <ellipse cx="30" cy="48" rx="22" ry="29" fill={`url(#${glow})`} className="fortune-lantern-fire" />
      </g>
      {RIBS.map((d) => (
        <path key={d} d={d} fill="none" stroke="rgba(40, 20, 10, 0.22)" strokeWidth="0.8" />
      ))}
      <text
        x="30"
        y="53"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill={c.text}
        style={{ fontFamily: "'Noto Serif KR', serif" }}
      >
        願
      </text>

      {/* 위·아래 검은 테 */}
      <rect x="17" y="13" width="26" height="7" rx="1.5" fill="#1d1512" />
      <rect x="19" y="14" width="22" height="1.2" fill="rgba(255, 255, 255, 0.18)" />
      <rect x="17" y="76" width="26" height="6" rx="1.5" fill="#1d1512" />

      {/* 술 */}
      <path d="M30 82 V86" stroke="#1d1512" strokeWidth="2" />
      <path d="M27 86 H33 L32 99 H28 Z" fill={spec.body === 'red' ? '#d9a441' : '#b92d17'} />
    </svg>
  );
}

export default function Shimenawa({ lanternLight }: { lanternLight: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[150px]" aria-hidden="true">
      {LANTERNS.map((spec, index) => (
        <WishLantern key={spec.left} spec={spec} index={index} lit={lanternLight} />
      ))}
      {/* 줄은 등의 끈 위에 오도록 나중에 그린다 */}
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
    </div>
  );
}
