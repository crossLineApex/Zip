import React, { useState, useEffect } from "react";
import './gameStyles.css';

const RotateBoard = ({ 
  gridConfig,
  maxNum, 
  start, 
  finalTime, 
  pointsEarned, 
  totalPoints, 
  isTimeOut,
  onStartGame, 
  onWinGame, 
  onNextLevel,
  onTryAgain
 }) => {
  // Local state to track modified track lines to avoid mutating the gridConfig prop
  const [tracksState, setTracksState] = useState({});
  const [isWon, setIsWon] = useState(false);

  // Synchronize and load new track layouts whenever the gridConfig prop updates
  useEffect(() => {
    if (!gridConfig) return;
    const initialState = {};
    gridConfig.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        initialState[`${rowIndex}-${colIndex}`] = cell.lines || [];
      });
    });
    setTracksState(initialState);
    setIsWon(false); // RESET WIN STATE WHEN A NEW GRID GENERATES
  }, [gridConfig]);

  // --- CLOCKWISE ROTATION ENGINE ---
  const getRotatedLines = (currentLines) => {
    if (!currentLines || currentLines.length === 0) return currentLines;

    // 1. Straight Track Swaps (Horizontal <-> Vertical)
    if (currentLines.includes("span-horizontal")) return ["span-vertical"];
    if (currentLines.includes("span-vertical")) return ["span-horizontal"];

    // 2. Corner Track Loop Rotations (Clockwise Cycle)
    const hasTop = currentLines.includes("span-half-top");
    const hasRight = currentLines.includes("span-half-right");
    const hasBottom = currentLines.includes("span-half-bottom");
    const hasLeft = currentLines.includes("span-half-left");

    if (hasTop && hasRight) return ["span-half-right", "span-half-bottom"];
    if (hasRight && hasBottom) return ["span-half-bottom", "span-half-left"];
    if (hasBottom && hasLeft) return ["span-half-left", "span-half-top"];
    if (hasLeft && hasTop) return ["span-half-top", "span-half-right"];

    return currentLines;
  };

  const toggleCell = (rowIndex, colIndex) => {
    
    if (isTimeOut || isWon) return;
    
    const key = `${rowIndex}-${colIndex}`;
    if (onStartGame) {
      onStartGame();
    }
    setTracksState((prev) => {
      const currentLines = prev[key] || [];
      // If the cell doesn't have track segments, don't waste render cycles
      if (currentLines.length === 0) return prev;

      return {
        ...prev,
        [key]: getRotatedLines(currentLines),
      };
    });
  };

  // Dynamically count rows and columns to retain full responsiveness
  const rowCount = gridConfig?.length || 7;
  const colCount = gridConfig?.[0]?.length || 7;

  // ============================================================================
  // FAST GRAPH TRAVERSAL VALIDATION ENGINE
  // ============================================================================
  useEffect(() => {
    // Guard: Prevent running on initial empty state mount
    if (Object.keys(tracksState).length === 0 || !gridConfig || isTimeOut) return;

    const validateZippedPath = () => {
      let startR = -1, startC = -1;
      [startR, startC] = start;

      // If clue 1 wasn't found, the board is structurally unplayable
      if (startR === -1) return false;

      // Helper function to map CSS classes to open directional pathways
      const getCellDirections = (lines) => {
        const dirs = [];
        if (!lines) return dirs;
        if (lines.includes("span-vertical")) dirs.push("top", "bottom");
        if (lines.includes("span-horizontal")) dirs.push("left", "right");
        if (lines.includes("span-half-top")) dirs.push("top");
        if (lines.includes("span-half-bottom")) dirs.push("bottom");
        if (lines.includes("span-half-left")) dirs.push("left");
        if (lines.includes("span-half-right")) dirs.push("right");
        return dirs;
      };

      let r = startR;
      let c = startC;
      let prevR = null;
      let prevC = null;
      
      const visited = new Set([`${r}-${c}`]);
      let currentExpectedNum = 1;
      const totalCellsCount = rowCount * colCount;

      // 2. Walk along the tracks cell by cell
      while (true) {
        const currentLines = tracksState[`${r}-${c}`] || [];
        const currentDirs = getCellDirections(currentLines);
        let exitDir = null;

        if (prevR === null) {
          // First Step: Look at all exits from cell 1, find the ONE that connects to a valid neighbor
          const validExits = [];
          for (const dir of currentDirs) {
            let nr = r, nc = c;
            let targetNeighborDir = "";
            if (dir === "top") { nr--; targetNeighborDir = "bottom"; }
            if (dir === "bottom") { nr++; targetNeighborDir = "top"; }
            if (dir === "left") { nc--; targetNeighborDir = "right"; }
            if (dir === "right") { nc++; targetNeighborDir = "left"; }

            if (nr >= 0 && nr < rowCount && nc >= 0 && nc < colCount) {
              const neighborLines = tracksState[`${nr}-${nc}`] || [];
              if (getCellDirections(neighborLines).includes(targetNeighborDir)) {
                validExits.push(dir);
              }
            }
          }
          // If there isn't exactly one functional connecting exit leaving cell 1, the track is broken
          if (validExits.length !== 1) return false;
          exitDir = validExits[0];
        } else {
          // Subsequent Steps: Filter out the track lane we just entered from
          let entryDir = "";
          if (prevR < r) entryDir = "top";
          if (prevR > r) entryDir = "bottom";
          if (prevC < c) entryDir = "left";
          if (prevC > c) entryDir = "right";

          const exits = currentDirs.filter(d => d !== entryDir);
          if (exits.length !== 1) return false; // Dead end or illegal track shape
          exitDir = exits[0];
        }

        // 3. Move to the next connected tile coordinate
        let nextR = r;
        let nextC = c;
        if (exitDir === "top") nextR--;
        if (exitDir === "bottom") nextR++;
        if (exitDir === "left") nextC--;
        if (exitDir === "right") nextC++;

        // Out of bounds check
        if (nextR < 0 || nextR >= rowCount || nextC < 0 || nextC >= colCount) return false;

        // Neighbor connection check: Verify the target cell has a track pointing back to us
        const nextLines = tracksState[`${nextR}-${nextC}`] || [];
        const nextDirs = getCellDirections(nextLines);
        if (exitDir === "top" && !nextDirs.includes("bottom")) return false;
        if (exitDir === "bottom" && !nextDirs.includes("top")) return false;
        if (exitDir === "left" && !nextDirs.includes("right")) return false;
        if (exitDir === "right" && !nextDirs.includes("left")) return false;

        const nextKey = `${nextR}-${nextC}`;
        // Loop protection check
        if (visited.has(nextKey)) return false;

        // Advance walker references forward
        prevR = r;
        prevC = c;
        r = nextR;
        c = nextC;
        visited.add(nextKey);

        // 4. Clue Verification Check
        const structuralNodeNumber = gridConfig[r][c]?.number;
        if (structuralNodeNumber) {
          // If we hit a numbered tile, it must be the immediate next chronological digit
          if (structuralNodeNumber !== currentExpectedNum + 1) return false;
          currentExpectedNum = structuralNodeNumber;

          // VICTORY CONDITION: Reached the end node, verify it spans 100% grid space coverage
          if (currentExpectedNum === maxNum) {
            return visited.size === totalCellsCount;
          }
        }
      }
    };

    // Execute check
    if (validateZippedPath()) {
      setTimeout(() => {
          setIsWon(true); //  Trigger the gorgeous custom UI overlay
          // Stop the parent clock immediately on path confirmation
         if (onWinGame) onWinGame();
        }, 600);
    }
  }, [tracksState, gridConfig, start, maxNum, rowCount, colCount, onWinGame, isTimeOut]);

  // Sizing matrix config lookup that automatically scales typography, lines, and gaps based on n
  const c = {
    5:  { line: 14, badge: 34, font: 16, gap: 6, mLine: 10, mBadge: 24, mFont: 12, mGap: 4 },
    6:  { line: 12, badge: 32, font: 15, gap: 6, mLine: 9,  mBadge: 21, mFont: 11, mGap: 4 },
    7:  { line: 11, badge: 28, font: 14, gap: 6, mLine: 8,  mBadge: 18, mFont: 10, mGap: 4 },
    8:  { line: 10, badge: 26, font: 13, gap: 6, mLine: 7,  mBadge: 16, mFont: 9,  mGap: 3 },
    9:  { line: 9,  badge: 24, font: 12, gap: 5, mLine: 6,  mBadge: 14, mFont: 8,  mGap: 3 },
    10: { line: 8,  badge: 21, font: 11, gap: 5, mLine: 5,  mBadge: 13, mFont: 8,  mGap: 2 },
    11: { line: 7,  badge: 19, font: 10, gap: 4, mLine: 4,  mBadge: 11, mFont: 7,  mGap: 2 },
    12: { line: 6,  badge: 17, font: 9,  gap: 4, mLine: 4,  mBadge: 10, mFont: 6,  mGap: 2 },
  }[rowCount] || { line: 10, badge: 26, font: 13, gap: 6, mLine: 7, mBadge: 16, mFont: 9, mGap: 3 };

 return (
  <div className="puzzle-container rotate-board-component">
    {/* This relative anchor container locks the overlay exactly to the board dimensions */}
    <div className="board-wrapper">
      
      <div
        className={`grid-board ${isWon ? "board-victory-glow" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        }}
      >
        {gridConfig.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const isPresetNode = cell.number !== undefined && cell.number !== null;
            const activeLines = tracksState[cellKey] || [];

            return (
              <div
                key={cellKey}
                className={`grid-cell ${isPresetNode ? "node-locked" : ""}`}
                onClick={isPresetNode ? undefined : () => toggleCell(rowIndex, colIndex)}
              >
                {activeLines.map((lineClass, index) => (
                  <div key={index} className={`line-segment ${lineClass}`} />
                ))}
                {cell.number && <div className="number-badge">{cell.number}</div>}
              </div>
            );
          })
        )}
      </div>

      {/* DYNAMIC VICTORY SCREEN OVERLAY */}
      {isWon && (
        <div className="victory-overlay">
          {/* Cascading CSS Confetti Pieces */}
          <div className="confetti-container">
            {[...Array(14)].map((_, i) => (
              <div key={i} className={`confetti p-${i}`} />
            ))}
          </div>

          <div className="victory-card">
            <h2>GRID ZIPPED!</h2>
            {/* Conditional elegant wrapper to show completion metric */}
            {finalTime && (
              <div className="victory-stats-container">
                {/* Row 1: Two Columns (Time & Current Level Earnings) */}
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

                {/* Row 2: Centered Single Column (Total Account Balance) */}
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
                setIsWon(false); // Close the modal locally
                if (onNextLevel) onNextLevel(); // Tell parent to regenerate a new grid
              }}>
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

    {/* Fully Overhauled Premium Game Styles */}
    <style>{`
      .rotate-board-component .puzzle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 0;
        font-family: system-ui, -apple-system, sans-serif;
        width: 100%;
        box-sizing: border-box;
      }

      /* CRITICAL FIX: The anchor container that forces the overlay to cover only the board */
      .rotate-board-component .board-wrapper {
        position: relative;
        width: 100%;
        max-width: 450px;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
      }

      .rotate-board-component .grid-board {
        display: grid;
        gap: ${c.gap}px; 
        background-color: #d6d7f8; 
        padding: 12px;
        border-radius: 24px;
        width: 100%;
        height: 100%;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      .rotate-board-component .grid-cell {
        position: relative;
        background-color: #ffffff;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.15s ease, transform 0.1s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
      }

      .rotate-board-component .grid-cell:not(.node-locked):active { transform: scale(0.95); }
      .rotate-board-component .grid-cell:hover:not(.node-locked) { background-color: #f1f5f9; }
      .rotate-board-component .grid-cell.node-locked { cursor: default; }
      .rotate-board-component .line-segment { position: absolute; background-color: #4A4FE0; z-index: 1; pointer-events: none; }

      .App.theme-dark .grid-board {
        background-color: var(--paper-dim);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      }

      .App.theme-dark .grid-cell {
        background-color: var(--paper);
        border: 1px solid var(--line);
        color: var(--ink);
      }

      .App.theme-dark .grid-cell:hover:not(.node-locked) { background-color: var(--paper-dim); }
      .App.theme-dark .grid-cell.node-locked { background-color: var(--paper-dim); }
      .App.theme-dark .number-badge { background-color: var(--ink); color: var(--paper); border-color: var(--paper-dim); }

      /* Track sizing logic calculations */
      .rotate-board-component .span-vertical { top: 0; bottom: 0; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .rotate-board-component .span-horizontal { left: 0; right: 0; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }
      .rotate-board-component .span-half-top { top: 0; height: 50%; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .rotate-board-component .span-half-bottom { top: 50%; height: 50%; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .rotate-board-component .span-half-left { left: 0; width: 50%; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }
      .rotate-board-component .span-half-right { left: 50%; width: 50%; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }

      .rotate-board-component .number-badge {
        position: relative;
        z-index: 2;
        width: ${c.badge}px;
        height: ${c.badge}px;
        background-color: #0f172a;
        color: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: ${c.font}px;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      /* ============================================================================
         THE JUICE: NEW HIGH-END VICTORY ANIMATION CODE
         ============================================================================ */
      
      /* Neon line glow animation when board is solved */
      .rotate-board-component .board-victory-glow .line-segment {
        animation: trackNeonPulse 1.2s infinite alternate ease-in-out;
        filter: drop-shadow(0 0 8px #00bda5) drop-shadow(0 0 16px rgba(0, 189, 165, 0.8));
      }

      @keyframes trackNeonPulse {
        0% { opacity: 0.85; filter: brightness(1) drop-shadow(0 0 4px #00bda5); }
        100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 14px #00bda5); }
      }

      /* Glassmorphism blur overlay locked strictly on top of the board frame */
      .rotate-board-component .victory-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(30, 21, 42, 0.45); /* Soft deep plum overlay tint */
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
        z-index: 50;
        animation: smoothFadeIn 0.35s ease-out forwards;
      }

      /* Spring animated modal card box */
      .rotate-board-component .victory-card {
        background: #ffffff;
        padding: 32px 24px;
        border-radius: 24px;
        text-align: center;
        width: 80%;
        max-width: 290px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.8);
        animation: dynamicScalePop 0.45s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
        z-index: 60;
      }

      .rotate-board-component .victory-card h2 {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 800;
        color: #1e152a;
        letter-spacing: 0.02em;
      }

      .rotate-board-component .victory-card p {
        margin: 0 0 24px 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.4;
        font-weight: 500;
      }

        /* Try Again Text Accents Override Style */
        .rotate-board-component .victory-card h2.timeout-title {
          color: #ff5252;
        }

        /* Try Again Selection Button Accent Overrides Style */
        .rotate-board-component .next-level-btn.timeout-btn {
          background-color: #ff5252;
          box-shadow: 0 4px 12px rgba(255, 82, 82, 0.25);
        }
        .rotate-board-component .next-level-btn.timeout-btn:hover {
          background-color: #e04343;
          box-shadow: 0 6px 16px rgba(255, 82, 82, 0.35);
        }

      /* --- OVERHAULED METRIC CONTAINER BLOCKS --- */
      .rotate-board-component .victory-stats-container {
        width: 100%;
        background-color: #f8fafc; /* Ultra-soft off-white slate background tint */
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 14px;
        margin-bottom: 22px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* Row 1 Layout Configuration */
      .rotate-board-component .stats-row.split-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed #cbd5e1; /* Subtle clean dividing vector line */
        padding-bottom: 10px;
      }

      .rotate-board-component .stat-box {
        display: flex;
        flex-direction: column;
      }

      .stat-box.align-left { text-align: left; }
      .stat-box.align-right { text-align: right; }

      .rotate-board-component .stat-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .rotate-board-component .stat-box strong {
        color: #0f172a;
        font-size: 15px;
        font-weight: 700;
      }

      /* Emerald highlighted green theme code for extra point notifications */
      .rotate-board-component .stat-box strong.points-plus {
        color: #00bda5;
      }

      /* Row 2 Layout Configuration */
      .rotate-board-component .stats-row.center-row {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 2px;
      }

      .rotate-board-component .stat-total {
        font-size: 13px;
        color: #475569;
        font-weight: 600;
      }

      .rotate-board-component .stat-total strong {
        font-size: 16px;
        font-weight: 800;
        color: #1e152a; /* Deep bold midnight accent color */
        margin-left: 4px;
      }

      /* Clean, heavily styled custom tactical call-to-action button */
      .rotate-board-component .next-level-btn {
        background: #1e152a; /* Deep midnight plum provides perfect heavy contrast */
        color: #ffffff;
        border: none;
        font-weight: 700;
        font-size: 14px;
        padding: 14px 0;
        width: 100%;
        border-radius: 14px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(30, 21, 42, 0.25);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .rotate-board-component .next-level-btn:hover {
        background: #4A4FE0;
        box-shadow: 0 6px 20px rgba(74, 79, 224, 0.4);
        transform: translateY(-1px);
      }

      .rotate-board-component .next-level-btn:active {
        transform: translateY(1px) scale(0.98);
      }

      /* --- CORE REUSABLE KEYFRAMES --- */
      @keyframes smoothFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dynamicScalePop { from { opacity: 0; transform: scale(0.75) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes iconSpinBounce { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(8deg); } }

      /* --- CASCADE FLOATING PARTICLE SYSTEM --- */
      .rotate-board-component .confetti-container { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; overflow: hidden; }
      .rotate-board-component .confetti { position: absolute; width: 6px; height: 10px; border-radius: 2px; opacity: 0.85; top: -15px; animation: particleRain 2.4s infinite linear; }

      .rotate-board-component .confetti.p-0  { left: 8%;  background: #00bda5; animation-delay: 0.1s; animation-duration: 2.0s; }
      .rotate-board-component .confetti.p-1  { left: 22%; background: #ff4a5a; animation-delay: 0.6s; animation-duration: 2.5s; }
      .rotate-board-component .confetti.p-2  { left: 36%; background: #ffca28; animation-delay: 0.2s; animation-duration: 2.2s; }
      .rotate-board-component .confetti.p-3  { left: 50%; background: #9c27b0; animation-delay: 0.9s; animation-duration: 2.8s; }
      .rotate-board-component .confetti.p-4  { left: 64%; background: #00bda5; animation-delay: 0.4s; animation-duration: 1.9s; }
      .rotate-board-component .confetti.p-5  { left: 78%; background: #ff4a5a; animation-delay: 0.8s; animation-duration: 2.4s; }
      .rotate-board-component .confetti.p-6  { left: 92%; background: #ffca28; animation-delay: 1.2s; animation-duration: 2.6s; }
      .rotate-board-component .confetti.p-7  { left: 15%; background: #9c27b0; animation-delay: 0.3s; animation-duration: 2.1s; }
      .rotate-board-component .confetti.p-8  { left: 29%; background: #00bda5; animation-delay: 1.4s; animation-duration: 2.9s; }
      .rotate-board-component .confetti.p-9  { left: 43%; background: #ff4a5a; animation-delay: 0.5s; animation-duration: 2.3s; }
      .rotate-board-component .confetti.p-10 { left: 58%; background: #ffca28; animation-delay: 1.0s; animation-duration: 2.4s; }
      .rotate-board-component .confetti.p-11 { left: 72%; background: #9c27b0; animation-delay: 0.7s; animation-duration: 2.7s; }
      .rotate-board-component .confetti.p-12 { left: 85%; background: #00bda5; animation-delay: 1.6s; animation-duration: 2.8s; }
      .rotate-board-component .confetti.p-13 { left: 95%; background: #ff4a5a; animation-delay: 0.2s; animation-duration: 2.2s; }

      @keyframes particleRain {
        0% { top: -15px; transform: translateX(0) rotate(0deg); }
        50% { transform: translateX(12px) rotate(180deg); }
        100% { top: 105%; transform: translateX(-12px) rotate(360deg); }
      }

      @media (max-width: 480px) {
        .rotate-board-component .span-vertical, .rotate-board-component .span-half-top, .rotate-board-component .span-half-bottom { width: ${c.mLine}px; left: calc(50% - ${c.mLine / 2}px); }
        .rotate-board-component .span-horizontal, .rotate-board-component .span-half-left, .rotate-board-component .span-half-right { height: ${c.mLine}px; top: calc(50% - ${c.mLine / 2}px); }
        .rotate-board-component .number-badge { width: ${c.mBadge}px; height: ${c.mBadge}px; font-size: ${c.mFont}px; border-width: 1.5px; }
        .rotate-board-component .grid-board { gap: ${c.mGap}px; padding: 8px; border-radius: 16px; }
        .rotate-board-component .puzzle-container {
    /* FIX: Strip all padding on mobile so the board uses 100% of the card width */
    padding: 0; 
  }

  .rotate-board-component .board-wrapper {
    /* FIX: Safeguard the board from being crushed by any parent flex box elements */
    flex-shrink: 0; 
    width: 100%;
    margin: 0 auto;
  }
      }
    `}</style>
  </div>
);
};

export default RotateBoard;