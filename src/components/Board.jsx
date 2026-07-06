import React, { useState, useEffect } from "react";

const Board = ({
  gridConfig,
  initialDots,
  numberBarChoices,
  numberBarColumns,
  solutionMap,          // Flat sequence map object: { "2-2": 1, "2-3": undefined, ... }
  finalTime,  
  pointsEarned,
  totalPoints,
  isTimeOut,            //Flags if the countdown timer hit zero
  onStartGame,
  onWinGame,
  onNextLevel,
  onTryAgain,           //Callback to trigger state resets on the parent
}) => {
  const [dotsState, setDotsState] = useState(initialDots || {});
  const [clickedCells, setClickedCells] = useState({});
  const [selected_number, setSelected_number] = useState(null);
  const [errorCell, setErrorCell] = useState(null);
  const [isWon, setIsWon] = useState(false);

  const rowCount = gridConfig.length;
  const placedNumbers = Object.values(clickedCells);

  const pathKeys = solutionMap ? Object.keys(solutionMap) : [];

  const baseSizingMatrix = {
    6:  { line: 14, badge: 34, font: 16, gap: 6, dot: 6, mLine: 10, mBadge: 24, mFont: 12, mGap: 4, mDot: 4 }, 
    7:  { line: 12, badge: 32, font: 15, gap: 6, dot: 6, mLine: 9,  mBadge: 21, mFont: 11, mGap: 4, mDot: 4 }, 
    8:  { line: 11, badge: 28, font: 14, gap: 6, dot: 5, mLine: 8,  mBadge: 18, mFont: 10, mGap: 4, mDot: 3 }, 
    9:  { line: 10, badge: 26, font: 13, gap: 6, dot: 5, mLine: 7,  mBadge: 16, mFont: 9,  mGap: 3, mDot: 3 }, 
    10: { line: 9,  badge: 24, font: 12, gap: 5, dot: 4, mLine: 6,  mBadge: 14, mFont: 8,  mGap: 3, mDot: 3 }, 
    11: { line: 8,  badge: 21, font: 11, gap: 5, dot: 4, mLine: 5,  mBadge: 13, mFont: 8,  mGap: 2, mDot: 2 }, 
  };

  const s = baseSizingMatrix[rowCount] || { 
    line: 10, badge: 26, font: 13, gap: 6, dot: 5, mLine: 7, mBadge: 16, mFont: 9, mGap: 3, mDot: 3 
  };

  // Three-stage step victory verification
  useEffect(() => {
    if (numberBarChoices.length === 0 || isTimeOut) return;

    const allNumbersPlaced = Object.keys(clickedCells).length === numberBarChoices.length;
    const allDotsFilled = Object.values(dotsState).every((dotArr) => !dotArr.includes("d"));

    if (allNumbersPlaced && allDotsFilled) {
      let lastNum = 0;
      let isPathOrderCorrect = true;

      for (let i = 0; i < pathKeys.length; i++) {
        const pKey = pathKeys[i];
        const [rStr, cStr] = pKey.split("-");
        const r = parseInt(rStr, 10);
        const c = parseInt(cStr, 10);
        
        const currentNum = gridConfig[r]?.[c]?.number || clickedCells[pKey];

        if (currentNum !== undefined && currentNum !== null) {
          const val = Number(currentNum);
          if (val <= lastNum) {
            isPathOrderCorrect = false;
            break;
          }
          lastNum = val;
        }
      }

      if (isPathOrderCorrect) {
        setTimeout(() => {
          setIsWon(true);
          if (onWinGame) onWinGame();
        }, 300);
      }
    }
  }, [clickedCells, dotsState, numberBarChoices, pathKeys, gridConfig, onWinGame, isTimeOut]);

  useEffect(() => {
    setDotsState(initialDots || {});
    setClickedCells({});
    setSelected_number(null);
    setIsWon(false);
  }, [gridConfig, initialDots]);

  const toggleCell = (rowIndex, colIndex) => {
    // Safety check: Block interactions if the level has timed out or is already solved
    if (isTimeOut || isWon) return;

    const key = `${rowIndex}-${colIndex}`;
    if (onStartGame) onStartGame();

    const hasNumber = clickedCells[key] !== undefined;
    const targetKeys = [`${rowIndex}-0`, `0-${colIndex}`];

    if (hasNumber) {
      setClickedCells((prev) => {
        const updatedCells = { ...prev };
        delete updatedCells[key]; 
        return updatedCells;
      });

      setDotsState((prevDots) => {
        const updatedDots = { ...prevDots };
        targetKeys.forEach((tKey) => {
          if (updatedDots[tKey]) {
            const arr = [...updatedDots[tKey]];
            const activeIdx = arr.indexOf("a");
            if (activeIdx !== -1) {
              arr[activeIdx] = "d";
              updatedDots[tKey] = arr;
            }
          }
        });
        return updatedDots;
      });
      return;
    }

    if (selected_number !== null) {
      let isError = false;

      if (dotsState[targetKeys[0]] && dotsState[targetKeys[1]]) {
        targetKeys.forEach((tKey) => {
          if (dotsState[tKey]) {
            const hasDefaultDot = dotsState[tKey].includes("d");
            if (!hasDefaultDot) {
              isError = true;
            }
          }
        });
      }

      const targetIdx = pathKeys.indexOf(key);
      const currentVal = Number(selected_number);

      if (targetIdx !== -1 && !isError) {
        for (let i = 0; i < pathKeys.length; i++) {
          if (i === targetIdx) continue;
          
          const pKey = pathKeys[i];
          const [rStr, cStr] = pKey.split("-");
          const r = parseInt(rStr, 10);
          const c = parseInt(cStr, 10);
          
          const existingNum = gridConfig[r]?.[c]?.number || clickedCells[pKey];

          if (existingNum !== undefined && existingNum !== null) {
            const checkVal = Number(existingNum);
            if (i < targetIdx && checkVal >= currentVal) {
              isError = true;
              break;
            }
            if (i > targetIdx && checkVal <= currentVal) {
              isError = true;
              break;
            }
          }
        }
      }

      if (isError) {
        setErrorCell(key);
        setTimeout(() => setErrorCell(null), 800);
        return;
      }

      setClickedCells((prev) => ({
        ...prev,
        [key]: selected_number,
      }));

      setSelected_number(null);

      setDotsState((prevDots) => {
        const updatedDots = { ...prevDots };
        targetKeys.forEach((tKey) => {
          if (updatedDots[tKey]) {
            const arr = [...updatedDots[tKey]];
            const defaultIdx = arr.indexOf("d");
            if (defaultIdx !== -1) {
              arr[defaultIdx] = "a";
              updatedDots[tKey] = arr;
            }
          }
        });
        return updatedDots;
      });
    }
  };

  return (
    <div className="game-layout">
      <div className="puzzle-container">
        <div className="grid-board">
          {gridConfig.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const playerNumber = clickedCells[cellKey];
              const isDot = dotsState[cellKey];

              return (
                <div
                  key={cellKey}
                  className={`grid-cell ${playerNumber ? "clicked" : ""} ${
                    cell.number ? "locked" : ""
                  } ${cell.dot ? "dot" : ""} ${
                    errorCell === cellKey ? "error-flash" : ""
                  }`}
                  onClick={
                    cell.number || cell.dot || cell.noClick || isTimeOut
                      ? undefined
                      : () => toggleCell(rowIndex, colIndex)
                  }
                >
                  {cell.lines.map((lineClass, index) => (
                    <div key={index} className={`line-segment ${lineClass}`} />
                  ))}

                  {isDot && isDot.length > 0 && (
                    <div className="dots-container">
                      {isDot.map((dotClass, dotIdx) => (
                        <div
                          key={dotIdx}
                          className={`indicator-dot ${dotClass || "default"}`}
                        />
                      ))}
                    </div>
                  )}

                  {(playerNumber || cell.number) && (
                    <div className="number-badge">
                      {playerNumber || cell.number}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* DYNAMIC VICTORY SCREEN OVERLAY */}
          {isWon && (
            <div className="victory-overlay">
              <div className="confetti-container">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className={`confetti p-${i}`} />
                ))}
              </div>

              <div className="victory-card">
                <h2>GRID ZIPPED!</h2>
                <p>Hamiltonian path completed flawlessly.</p>
                {finalTime && (
                  <div className="victory-stats-container">
                    <div className="stats-row split-row">
                      <div className="stat-box align-left">
                        <span className="stat-label">Time Taken</span>
                        <strong>{finalTime}</strong>
                      </div>
                      <div className="stat-box align-right">
                        <span className="stat-label">Points Earned</span>
                        <strong className="points-plus">+{pointsEarned}</strong>
                      </div>
                    </div>

                    <div className="stats-row center-row">
                      <div className="stat-total">
                        Total Points: <strong>{totalPoints}</strong>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  className="next-level-btn"
                  onClick={() => {
                    setIsWon(false);
                    if (onNextLevel) onNextLevel();
                  }}
                >
                  Keep Zipping
                </button>
              </div>
            </div>
          )}


          {/* ============================================================================
             NEW: TRY AGAIN TIME-OUT OVERLAY CONTAINER
             Reuses your premium glassmorphism layouts but themes it for a retry
             ============================================================================ */}
          {isTimeOut && (
            <div className="victory-overlay timeout-theme">
              <div className="victory-card">
                <h2 className="timeout-title">TIME OUT!</h2>
                <p>Ooops</p>
                
                <button 
                  className="next-level-btn timeout-btn"
                  onClick={onTryAgain}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
        .game-layout {
            display: block;
            width: 100%;
            box-sizing: border-box;
        }

        .dots-container {
          display: flex;
          flex-wrap: wrap;
          gap: ${rowCount >= 8 ? "2px" : "4px"}; 
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 2;
          padding: 2px;
          box-sizing: border-box;
        }

        .indicator-dot {
          width: ${s.dot}px;
          height: ${s.dot}px;
          border-radius: 50%;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .indicator-dot.d { background-color: #cbd5e1; border: 1px solid #94a3b8; }
        .indicator-dot.a { background-color: #ff5252; box-shadow: 0 0 6px rgba(255, 82, 82, 0.4); }

        .number-bar {
          display: flex;
          flex-wrap: wrap;       
          gap: 6px;              
          justify-content: center; 
          align-items: center;
          width: 100%;
          max-width: 450px; 
          margin: 15px auto 25px auto;
          padding: 0 8px;        
          box-sizing: border-box;
          user-select: none;
        }
  
        .bar-cell {
          background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px;        
          display: flex; align-items: center; justify-content: center;
          width: 36px; aspect-ratio: 1 / 1; font-weight: 700; font-size: 14px;           
          color: #334155; cursor: pointer; transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }
  
        .bar-cell:hover { background-color: #f8fafc; border-color: #94a3b8; color: #0f172a; transform: translateY(-1px); box-shadow: 0 3px 5px rgba(15, 23, 42, 0.06); }
        .bar-cell:focus { outline: none; border-color: #00bda5; box-shadow: 0 0 0 2px rgba(0, 189, 165, 0.2); }
        .bar-cell.selected { background-color: #00bda5; color: #ffffff; transform: scale(1.02) translateY(-1px); box-shadow: 0 3px 8px rgba(0, 189, 165, 0.25); }
        .bar-cell.disabled { background-color: #f1f5f9; border-color: #e2e8f0; color: #cbd5e1; cursor: not-allowed; pointer-events: none; transform: none !important; box-shadow: none !important; }
        .bar-cell:active { transform: scale(0.95); }

        .puzzle-container { display: flex; justify-content: center; align-items: center; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
        
        .grid-board {
          display: grid; 
          grid-template-columns: repeat(${rowCount}, 1fr); 
          grid-template-rows: repeat(${rowCount}, 1fr);
          gap: ${s.gap}px; 
          background-color: #ccf1ed; 
          padding: 12px; 
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); 
          width: 100%; 
          max-width: 450px; 
          aspect-ratio: 1 / 1; 
          box-sizing: border-box;
          position: relative;
        }

        .grid-cell {
          position: relative; background-color: #ffffff; border-radius: ${rowCount >= 8 ? "4px" : "8px"}; 
          cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease;
          display: flex; align-items: center; justify-content: center; user-select: none;
        }

        .grid-cell:hover { background-color: #f1f5f9; }
        .grid-cell.clicked { background-color: #d7e3cc; }
        .grid-cell.dot { background-color: #ccf1ed; pointer-events: none; }

        .line-segment { position: absolute; background-color: #00bda5; z-index: 1; pointer-events: none; }

        .span-vertical { top: 0; bottom: 0; left: calc(50% - ${s.line / 2}px); width: ${s.line}px; }
        .span-horizontal { left: 0; right: 0; top: calc(50% - ${s.line / 2}px); height: ${s.line}px; }
        .span-half-top { top: 0; height: 50%; left: calc(50% - ${s.line / 2}px); width: ${s.line}px; }
        .span-half-bottom { top: 50%; height: 50%; left: calc(50% - ${s.line / 2}px); width: ${s.line}px; }
        .span-half-left { left: 0; width: 50%; top: calc(50% - ${s.line / 2}px); height: ${s.line}px; }
        .span-half-right { left: 50%; width: 50%; top: calc(50% - ${s.line / 2}px); height: ${s.line}px; }

        .number-badge { position: relative; z-index: 3; width: ${s.badge}px; height: ${s.badge}px; font-size: ${s.font}px; background-color: #0f172a; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; border: ${rowCount >= 8 ? "1px" : "2px"} solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        
        @keyframes cellErrorFill {
          0% { background-color: #ffffff; box-shadow: none; transform: scale(1); }
          20% { background-color: #ff4d4d; border-color: #ff1a1a; box-shadow: 0 0 14px rgba(239, 68, 68, 0.6); transform: scale(1.04); }
          70% { background-color: #ff1a1a; border-color: #ff4d4d; box-shadow: 0 0 14px rgba(239, 68, 68, 0.6); transform: scale(1.04); }
          100% { background-color: #ffffff; box-shadow: none; transform: scale(1); }
        }
        .grid-cell.error-flash { animation: cellErrorFill 0.8s cubic-bezier(0.25, 1, 0.5, 1); z-index: 10; }

        .board-victory-glow .line-segment {
          animation: trackNeonPulse 1.2s infinite alternate ease-in-out;
          filter: drop-shadow(0 0 8px #00bda5) drop-shadow(0 0 16px rgba(0, 189, 165, 0.8));
        }

        @keyframes trackNeonPulse {
          0% { opacity: 0.85; filter: brightness(1) drop-shadow(0 0 4px #00bda5); }
          100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 14px #00bda5); }
        }

        .victory-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          grid-column: 1 / -1;
          grid-row: 1 / -1;
          background: rgba(26, 18, 36, 0.6); 
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          z-index: 50;
          padding: 16px;
          box-sizing: border-box;
          animation: smoothFadeIn 0.3s ease-out forwards;
        }

        /* Try Again Text Accents Override Style */
        .victory-card h2.timeout-title {
          color: #ff5252;
        }

        /* Try Again Selection Button Accent Overrides Style */
        .next-level-btn.timeout-btn {
          background-color: #ff5252;
          box-shadow: 0 4px 12px rgba(255, 82, 82, 0.25);
        }
        .next-level-btn.timeout-btn:hover {
          background-color: #e04343;
          box-shadow: 0 6px 16px rgba(255, 82, 82, 0.35);
        }

        .victory-card {
          background: #ffffff;
          padding: 24px 20px;
          border-radius: 20px;
          text-align: center;
          width: 90%;
          max-width: 280px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.9);
          animation: dynamicScalePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          z-index: 60;
          box-sizing: border-box;
        }

        .victory-card h2 { margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #1e152a; letter-spacing: -0.01em; }
        .victory-card p { margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.4; font-weight: 500; }

        .victory-stats-container {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stats-row.split-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; }
        .stat-box { display: flex; flex-direction: column; }
        .stat-box.align-left { text-align: left; }
        .stat-box.align-right { text-align: right; }
        .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; font-weight: 600; margin-bottom: 1px; }
        .stat-box strong { color: #0f172a; font-size: 14px; font-weight: 700; }
        .stat-box strong.points-plus { color: #00bda5; }
        .stats-row.center-row { display: flex; justify-content: center; align-items: center; padding-top: 2px; }
        .stat-total { font-size: 12px; color: #475569; font-weight: 600; }
        .stat-total strong { font-size: 14px; font-weight: 800; color: #1e1b4b; margin-left: 2px; }

        .next-level-btn {
          width: 100%;
          background-color: #00bda5;
          color: #ffffff;
          border: none;
          padding: 10px 0;
          font-weight: 700;
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          user-select: none;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 189, 165, 0.25);
        }

        .next-level-btn:hover { background-color: #00a48f; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 189, 165, 0.35); }
        .next-level-btn:active { transform: scale(0.97) translateY(0); box-shadow: 0 2px 6px rgba(0, 189, 165, 0.2); }

        @keyframes smoothFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dynamicScalePop { from { opacity: 0; transform: scale(0.82) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .confetti-container { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; overflow: hidden; border-radius: 24px; }
        .confetti { position: absolute; width: 5px; height: 8px; border-radius: 1.5px; opacity: 0.8; top: -15px; animation: particleRain 2.2s infinite linear; }

        .confetti.p-0  { left: 8%;  background: #00bda5; animation-delay: 0.1s; animation-duration: 2.0s; }
        .confetti.p-1  { left: 22%; background: #ff4a5a; animation-delay: 0.6s; animation-duration: 2.5s; }
        .confetti.p-2  { left: 36%; background: #ffca28; animation-delay: 0.2s; animation-duration: 2.2s; }
        .confetti.p-3  { left: 50%; background: #9c27b0; animation-delay: 0.9s; animation-duration: 2.8s; }
        .confetti.p-4  { left: 64%; background: #00bda5; animation-delay: 0.4s; animation-duration: 1.9s; }
        .confetti.p-5  { left: 78%; background: #ff4a5a; animation-delay: 0.8s; animation-duration: 2.4s; }
        .confetti.p-6  { left: 92%; background: #ffca28; animation-delay: 1.2s; animation-duration: 2.6s; }
        .confetti.p-7  { left: 15%; background: #9c27b0; animation-delay: 0.3s; animation-duration: 2.1s; }
        .confetti.p-8  { left: 29%; background: #00bda5; animation-delay: 1.4s; animation-duration: 2.9s; }
        .confetti.p-9  { left: 43%; background: #ff4a5a; animation-delay: 0.5s; animation-duration: 2.3s; }
        .confetti.p-10 { left: 58%; background: #ffca28; animation-delay: 1.0s; animation-duration: 2.4s; }
        .confetti.p-11 { left: 72%; background: #9c27b0; animation-delay: 0.7s; animation-duration: 2.7s; }
        .confetti.p-12 { left: 85%; background: #00bda5; animation-delay: 1.6s; animation-duration: 2.8s; }
        .confetti.p-13 { left: 95%; background: #ff4a5a; animation-delay: 0.2s; animation-duration: 2.2s; }

        @keyframes particleRain {
          0% { top: -15px; transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(180deg); }
          100% { top: 105%; transform: translateX(-8px) rotate(360deg); }
        }

        @media (max-width: 480px) {
            .span-vertical, .span-half-top, .span-half-bottom { width: ${s.mLine}px; left: calc(50% - ${s.mLine / 2}px); }
            .span-horizontal, .span-half-left, .span-half-right { height: ${s.mLine}px; top: calc(50% - ${s.mLine / 2}px); }
            .number-badge { width: ${s.mBadge}px; height: ${s.mBadge}px; font-size: ${s.mFont}px; border-width: 1px; }
            .grid-board { gap: ${s.mGap}px; padding: 8px; border-radius: 16px; }
            .number-bar { gap: 4px; margin: 12px auto 20px auto; }
            .bar-cell { width: 28px; font-size: 11px; border-radius: 6px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02); }
            .bar-cell.selected { box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2); }
            .indicator-dot { width: ${s.mDot}px; height: ${s.mDot}px; }
            .dots-container { gap: 1px; padding: 1px; }

            .victory-overlay { padding: 8px; border-radius: 16px; }
            .victory-card { padding: 14px 12px; border-radius: 16px; max-width: 220px; box-shadow: 0 12px 24px rgba(15, 23, 42, 0.4); }
            .victory-card h2 { font-size: 15px; margin-bottom: 2px; }
            .victory-card p { font-size: 10px; margin-bottom: 10px; }
            .victory-stats-container { padding: 6px 8px; margin-bottom: 12px; gap: 4px; border-radius: 8px; }
            .stats-row.split-row { padding-bottom: 4px; }
            .stat-label { font-size: 8px; }
            .stat-box strong { font-size: 11px; }
            .stat-total { font-size: 10px; }
            .stat-total strong { font-size: 12px; }
            .next-level-btn { padding: 7px 0; font-size: 11px; border-radius: 6px; }
            .confetti-container { border-radius: 16px; }
          }
      `}</style>
      </div>

      <div className="number-bar">
        {numberBarChoices.map((num) => {
          const isPlaced = placedNumbers.includes(num);

          return (
            <div
              key={num}
              className={`bar-cell ${selected_number === num ? "selected" : ""} ${
                isPlaced ? "disabled" : ""
              }`}
              onClick={isPlaced ? undefined : () => setSelected_number(selected_number === num ? null : num)}
              tabIndex={isPlaced ? -1 : 0}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;