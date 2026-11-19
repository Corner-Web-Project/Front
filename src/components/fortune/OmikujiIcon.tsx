import type { CSSProperties } from 'react';
import './omikuji-icon.css';

// Three fortune sticks and the wooden slats of an omikuji container.
export default function OmikujiIcon({ size = 20, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <span
      className="omikuji-icon"
      aria-hidden="true"
      style={{ width: size, height: size, '--omikuji-stroke': `${strokeWidth}px` } as CSSProperties}
    >
      <span className="omikuji-icon__stick omikuji-icon__stick--left" />
      <span className="omikuji-icon__stick omikuji-icon__stick--middle" />
      <span className="omikuji-icon__stick omikuji-icon__stick--right" />
      <span className="omikuji-icon__barrel" />
      <span className="omikuji-icon__rim" />
    </span>
  );
}
