const Header = ({ onPuzzleSelect, selectedPuzzle, onBrandClick, darkMode, onToggleTheme }) => {
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
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" className="theme-toggle-icon" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="theme-toggle-icon" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
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
