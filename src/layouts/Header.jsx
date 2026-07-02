const Header = ({ onPuzzleSelect, selectedPuzzle, onBrandClick }) => {
  return (
    <header>
      <div className="header-inner">
        <a href="/" className="brand" onClick={(event) => {
          event.preventDefault();
          onBrandClick();
        }}>
          <svg className="brand-mark" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="1" y="1" width="26" height="26" rx="7" fill="#fff" stroke="var(--line)" />
            <circle cx="8" cy="20" r="2.6" fill="var(--zipa)" />
            <circle cx="20" cy="8" r="2.6" fill="var(--zipb)" />
            <path d="M8 20 L8 14 L14 14 L14 8 L20 8" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="brand-name">anytime ZIP</span>
        </a>

        <div className="header-ctas">
          <button
            type="button"
            className={`chip-btn a ${selectedPuzzle === 'flip' ? 'active' : ''}`}
            onClick={() => onPuzzleSelect('flip')}
          >
            <span className="chip-dot"></span>
            <span className="chip-btn-label-full">Play</span> Zip Flip
          </button>
          <button
            type="button"
            className={`chip-btn b ${selectedPuzzle === 'dot' ? 'active' : ''}`}
            onClick={() => onPuzzleSelect('dot')}
          >
            <span className="chip-dot"></span>
            <span className="chip-btn-label-full">Play</span> Zip Dot
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
