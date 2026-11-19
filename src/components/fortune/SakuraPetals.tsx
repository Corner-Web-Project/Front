import type { CSSProperties } from 'react';

const PETALS = Array.from({ length: 36 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 91.3 + n * 17.9) * 10000) % 1 + 1) % 1;
  return {
    left: r(1) * 100,
    delay: r(2) * 5,
    duration: 6 + r(3) * 5,
    sway: (r(4) - 0.5) * 160,
    scale: 0.7 + r(5) * 0.7,
  };
});

/** 대길일 때 흩날리는 벚꽃잎 */
export default function SakuraPetals() {
  return (
    <div aria-hidden="true">
      {PETALS.map((petal, i) => (
        <span
          key={i}
          className="fortune-petal"
          style={
            {
              left: `${petal.left}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
              animationIterationCount: 2,
              scale: String(petal.scale),
              '--sway': `${petal.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
