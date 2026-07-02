const PuzzleCard = ({ variant, label, puzzleNumber, path, dots, difficulty, streak, buttonLabel }) => {
  const isZipA = variant === 'a';

  return (
    <article className={`puzzle-card ${variant}`}>
      <div className="pc-top">
        <span className="pc-tag"><span className="swatch"></span>{label}</span>
        <span className="pc-meta">{puzzleNumber}</span>
      </div>
      <div className="pc-board">
        <svg viewBox="0 0 220 220" role="img" aria-label={`${label} puzzle preview`}>
          <g stroke="#ffffff" strokeWidth="1">
            <line x1="20" y1="20" x2="200" y2="20" />
            <line x1="20" y1="74" x2="200" y2="74" />
            <line x1="20" y1="128" x2="200" y2="128" />
            <line x1="20" y1="182" x2="200" y2="182" />
            <line x1="20" y1="20" x2="20" y2="182" />
            <line x1="74" y1="20" x2="74" y2="182" />
            <line x1="128" y1="20" x2="128" y2="182" />
            <line x1="182" y1="20" x2="182" y2="182" />
          </g>
          <path className="path-line" d={path} fill="none" stroke={isZipA ? '#4A4FE0' : '#1E8F6B'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {dots.map((dot) => (
            <g key={`${dot.label}-${dot.x}-${dot.y}`}>
              <circle cx={dot.x} cy={dot.y} r="10" fill={isZipA ? '#4A4FE0' : '#1E8F6B'} />
              <text x={dot.x} y={dot.y + 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#fff">
                {dot.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="pc-foot">
        <div className="pc-info">
          <div className="difficulty" aria-label="difficulty">
            {[1, 2, 3].map((step) => (
              <span key={step} className={`diff-dot ${step <= difficulty ? 'on' : ''} ${variant}`}></span>
            ))}
            <span className="diff-label">{difficulty === 3 ? 'Hard' : difficulty === 2 ? 'Medium' : 'Easy'}</span>
          </div>
          <div className="streak">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        </div>
        <a className="play-btn" href="#top">{buttonLabel}</a>
      </div>
    </article>
  );
};

export default PuzzleCard;
