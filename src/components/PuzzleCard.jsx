const PuzzleCard = ({ variant, label}) => {
  const isZipFlip = variant === 'a';
  const isZipDot = variant === 'b';

  return (
    <article className={`puzzle-card ${variant}`}>
      <div className="pc-top">
        <span className="pc-tag"><span className="swatch"></span>{label}</span>
      </div>
      <div className="pc-board">
      {isZipFlip && (
        <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <style>
            {`
            .rotator1{
              transform-origin: 101px 47px;
              animation: rotateSeg 3s ease-in-out infinite;
          }
          @keyframes rotateSeg{
            0%   { transform: rotate(0deg); }
            20%  { transform: rotate(0deg); }
            35%  { transform: rotate(90deg); }
            65%  { transform: rotate(90deg); }
            80%  { transform: rotate(180deg); }
            100% { transform: rotate(180deg); }
          }

          .rotator2{
            transform-origin: 47px 101px;
            animation: rotateElbow 4s ease-in-out infinite;
          }
          @keyframes rotateElbow{
            0%   { transform: rotate(0deg); }
            15%  { transform: rotate(0deg); }
            25%  { transform: rotate(90deg); }
            40%  { transform: rotate(90deg); }
            50%  { transform: rotate(180deg); }
            65%  { transform: rotate(180deg); }
            75%  { transform: rotate(270deg); }
            90%  { transform: rotate(270deg); }
            100% { transform: rotate(360deg); }
          }

          @media (prefers-reduced-motion: reduce){
            .rotator1, .rotator2{ animation: none; }
          }
          `}
        </style>

        <g stroke="#fff" strokeWidth="1">
          <line x1="20" y1="20" x2="182.5" y2="20" />
          <line x1="20" y1="74" x2="182.5" y2="74" />
          <line x1="20" y1="128" x2="182.5" y2="128" />
          <line x1="20" y1="182" x2="182.5" y2="182" />
          <line x1="20" y1="20" x2="20" y2="182" />
          <line x1="74" y1="20" x2="74" y2="182" />
          <line x1="128" y1="20" x2="128" y2="182" />
          <line x1="182" y1="20" x2="182" y2="182" />
        </g>

          <path d="M47,47 L74,47" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path className="rotator1" d="M75.5,47 L126.5,47" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" fill="none"/>

          <path d="M128,47 L155,47 L155,101 L74,101" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

          <path className="rotator2" d="M73,101 L47,101 L47,128" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

          <path d="M47,128 L47,155 L155,155" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

          <circle cx="47" cy="47" r="9" fill="black"></circle>
          <text x="47" y="51" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">1</text>
          <circle cx="101" cy="101" r="9" fill="black"></circle>
          <text x="101" y="105" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">2</text>
          <circle cx="155" cy="155" r="9" fill="black"></circle>
          <text x="155" y="159" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">3</text>
      </svg>
    )}
      {isZipDot && (
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    {`
    @keyframes squareHighlight {
      0%, 10%   { fill: #334155; }
      20%, 85%  { fill: #1E8F6B; }
      100%      { fill: #334155; }
    }

    @keyframes cellReveal {
      0%, 20%   { opacity: 0; }
      30%, 80%  { opacity: 1; }
      100%      { opacity: 0; }
    }

    @keyframes dotActivate {
      0%, 35%   { fill: #cbd5e1; stroke: #94a3b8; }
      45%, 90%  { fill: #ff5252; stroke: #ff5252; }
      100%      { fill: #cbd5e1; stroke: #94a3b8; }
    }

    .num2-square {
      animation: squareHighlight 8s ease-in-out infinite;
    }

    .cell2-group {
      animation: cellReveal 8s ease-in-out infinite;
    }

    .mid-dot {
      animation: dotActivate 8s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .num2-square, .cell2-group, .mid-dot {
        animation: none;
      }
    }
    `}
  </style>

  <g stroke="#fff" strokeWidth="1">
    <line x1="20" y1="20" x2="182.5" y2="20" />
    <line x1="20" y1="74" x2="182.5" y2="74" />
    <line x1="20" y1="128" x2="182.5" y2="128" />
    <line x1="20" y1="182" x2="182.5" y2="182" />
    <line x1="20" y1="20" x2="20" y2="182" />
    <line x1="74" y1="20" x2="74" y2="182" />
    <line x1="128" y1="20" x2="128" y2="182" />
    <line x1="182" y1="20" x2="182" y2="182" />
  </g>

  {/* dots above row 1, one per column, sitting above the top grid line */}
  <circle cx="47" cy="10" r="3" fill="#ff5252" />
  <circle className="mid-dot" cx="101" cy="10" r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
  <circle cx="155" cy="10" r="3" fill="#ff5252" />

  {/* dots left of column 1, one per row, sitting outside the left grid line */}
  <circle cx="10" cy="47" r="3" fill="#ff5252" />
  <circle className="mid-dot" cx="10" cy="101" r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
  <circle cx="10" cy="155" r="3" fill="#ff5252" />

  <path
    d="M47,47 L128,47 L155,47 L155,101 L74,101 L47,101 L47,128 L47,155 L155,155"
    stroke="var(--zipb)"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />

  <circle cx="47" cy="47" r="9" fill="black"></circle>
  <text x="47" y="51" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">1</text>

  <circle cx="155" cy="155" r="9" fill="black"></circle>
  <text x="155" y="159" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">3</text>

  {/* number 2 in the grid cell, revealed during the animation */}
  <g className="cell2-group">
    <circle cx="101" cy="101" r="9" fill="black" />
    <text x="101" y="105" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">2</text>
  </g>

  {/* number 2 in a square, below and outside the grid */}
  <rect className="num2-square" x="90" y="195" width="20" height="20" rx="2" fill="#334155" />
  <text x="100" y="209" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">2</text>
</svg>

      )}
      </div>
      <div className="pc-foot">
        <div className="pc-info">
          {isZipFlip ? (
            <>
            <p>Tap non numbered grid tiles to flip their orientations</p>
            <p>rotate the path segments</p>
            <p>Align every single piece correctly to form one seamless line across the entire board.</p>
            </>
          ) : (
            <>
            <p>The path is already drawn, also 1 and the last number are already revealed</p>
            <p>Place remaining numbers on the path</p>
            <p>The dots above the grid are the column markers, and the dots to the left of the grid are the row markers telling how many numbered cells can be there</p>
            <svg>
                <circle cx="47" cy="10" r="3" fill="#ff5252" />
                <text x="140" y="13" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="16" fill="#5B5F66"> - numbers revealed already</text>

                <circle cx="47" cy="50" r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <text x="122" y="53" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="16" fill="#5B5F66"> - numbers remaining</text>
            </svg>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default PuzzleCard;