import React, { useState, useEffect } from "react";

const RotateBoard = ({ gridConfig, maxNum, start, onNextLevel }) => {
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
    const key = `${rowIndex}-${colIndex}`;
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
    if (Object.keys(tracksState).length === 0 || !gridConfig) return;

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
        }, 300);
    }
  }, [tracksState, gridConfig, start, maxNum, rowCount, colCount]);

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
  <div className="puzzle-container">
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
            <div className="victory-icon-shield">
              <span className="lightning-icon">⚡</span>
            </div>
            <h2>GRID ZIPPED!</h2>
            <p>You are on ROLL!!</p>
            
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

    </div>

    {/* Fully Overhauled Premium Game Styles */}
    <style>{`
      .puzzle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        width: 100%;
        box-sizing: border-box;
      }

      /* CRITICAL FIX: The anchor container that forces the overlay to cover only the board */
      .board-wrapper {
        position: relative;
        width: 100%;
        max-width: 450px;
        aspect-ratio: 1 / 1;
      }

      .grid-board {
        display: grid;
        gap: ${c.gap}px; 
        background-color: #e2e8f0; 
        padding: 12px;
        border-radius: 24px;
        width: 100%;
        height: 100%;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      .grid-cell {
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

      .grid-cell:not(.node-locked):active { transform: scale(0.95); }
      .grid-cell:hover:not(.node-locked) { background-color: #f1f5f9; }
      .grid-cell.node-locked { cursor: default; }
      .line-segment { position: absolute; background-color: #00bda5; z-index: 1; pointer-events: none; }

      /* Track sizing logic calculations */
      .span-vertical { top: 0; bottom: 0; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .span-horizontal { left: 0; right: 0; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }
      .span-half-top { top: 0; height: 50%; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .span-half-bottom { top: 50%; height: 50%; left: calc(50% - ${c.line / 2}px); width: ${c.line}px; }
      .span-half-left { left: 0; width: 50%; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }
      .span-half-right { left: 50%; width: 50%; top: calc(50% - ${c.line / 2}px); height: ${c.line}px; }

      .number-badge {
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
      .board-victory-glow .line-segment {
        animation: trackNeonPulse 1.2s infinite alternate ease-in-out;
        filter: drop-shadow(0 0 8px #00bda5) drop-shadow(0 0 16px rgba(0, 189, 165, 0.8));
      }

      @keyframes trackNeonPulse {
        0% { opacity: 0.85; filter: brightness(1) drop-shadow(0 0 4px #00bda5); }
        100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 14px #00bda5); }
      }

      /* Glassmorphism blur overlay locked strictly on top of the board frame */
      .victory-overlay {
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
      .victory-card {
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

      /* Styled geometric badge wrapper around the lightning bolt icon */
      .victory-icon-shield {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #00bda5 0%, #009381 100%);
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
        box-shadow: 0 8px 20px rgba(0, 189, 165, 0.35);
        animation: iconSpinBounce 2.5s infinite ease-in-out;
      }

      .lightning-icon {
        font-size: 34px;
        color: #ffffff;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
      }

      .victory-card h2 {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 800;
        color: #1e152a;
        letter-spacing: 0.02em;
      }

      .victory-card p {
        margin: 0 0 24px 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.4;
        font-weight: 500;
      }

      /* Clean, heavily styled custom tactical call-to-action button */
      .next-level-btn {
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

      .next-level-btn:hover {
        background: #00bda5; /* Flashes emerald on hover to indicate play path */
        box-shadow: 0 6px 20px rgba(0, 189, 165, 0.4);
        transform: translateY(-1px);
      }

      .next-level-btn:active {
        transform: translateY(1px) scale(0.98);
      }

      /* --- CORE REUSABLE KEYFRAMES --- */
      @keyframes smoothFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dynamicScalePop { from { opacity: 0; transform: scale(0.75) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes iconSpinBounce { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(8deg); } }

      /* --- CASCADE FLOATING PARTICLE SYSTEM --- */
      .confetti-container { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; overflow: hidden; }
      .confetti { position: absolute; width: 6px; height: 10px; border-radius: 2px; opacity: 0.85; top: -15px; animation: particleRain 2.4s infinite linear; }

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
        50% { transform: translateX(12px) rotate(180deg); }
        100% { top: 105%; transform: translateX(-12px) rotate(360deg); }
      }

      @media (max-width: 480px) {
        .span-vertical, .span-half-top, .span-half-bottom { width: ${c.mLine}px; left: calc(50% - ${c.mLine / 2}px); }
        .span-horizontal, .span-half-left, .span-half-right { height: ${c.mLine}px; top: calc(50% - ${c.mLine / 2}px); }
        .number-badge { width: ${c.mBadge}px; height: ${c.mBadge}px; font-size: ${c.mFont}px; border-width: 1.5px; }
        .grid-board { gap: ${c.mGap}px; padding: 8px; border-radius: 16px; }
      }
    `}</style>
  </div>
);
};

export default RotateBoard;