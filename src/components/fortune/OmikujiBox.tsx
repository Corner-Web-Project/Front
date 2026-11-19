interface OmikujiBoxProps {
  shaking: boolean;
  stick: 'hidden' | 'rising' | 'leaving';
  stickNumber?: number;
  disabled: boolean;
  onShake: () => void;
}

/** 나무 질감의 육각형 오미쿠지 통 */
export default function OmikujiBox({ shaking, stick, stickNumber, disabled, onShake }: OmikujiBoxProps) {
  return (
    <button
      type="button"
      className={`omikuji-box ${shaking ? 'is-shaking' : ''}`}
      onClick={onShake}
      disabled={disabled}
      aria-label="오미쿠지 통 흔들기"
    >
      {stick !== 'hidden' && (
        <span className="omikuji-stick-clip">
          <span className={`omikuji-stick ${stick === 'rising' ? 'is-rising' : 'is-leaving'}`}>
            <span className="fortune-vertical">
              <span className="fortune-tcy">{stickNumber}</span>번
            </span>
          </span>
        </span>
      )}

      <span className="omikuji-body">
        <span className="omikuji-face side left omikuji-wood" />
        <span className="omikuji-face center omikuji-wood">
          <span className="omikuji-label">御神籤</span>
        </span>
        <span className="omikuji-face side right omikuji-wood" />
      </span>
      <span className="omikuji-band" style={{ top: 30 }} />
      <span className="omikuji-band" style={{ bottom: 10 }} />
      <span className="omikuji-top omikuji-wood" />
      <span className="omikuji-hole" />
    </button>
  );
}
