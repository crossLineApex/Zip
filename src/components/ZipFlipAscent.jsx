import React, { useState, useMemo, useEffect } from "react";
import RotateBoard from "./RotateBoard.jsx";
import ScrambledGridConfig from "../assets/ScrambledGridConfig.js";
import generateZipGridConfig from "../assets/levelGenerator.js";
import ReverseTimer from "./ReverseTimer.jsx";
import { TIME_LIMITS } from "../assets/timeConfig.js";

const ZipFlipAscent = () => {
  const [level, setLevel] = useState(1);
  const [refreshKey, setRefreshKey] = useState(1);
  //Single trigger state to activate the clock
  const [isTimerActive, setIsTimerActive] = useState(false);
  //Holds the frozen victory time string
  const [finalTime, setFinalTime] = useState("");
  // NEW SCORE ENGINE TRACK STATE VARIABLES
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  // Tracking state for handling when the timer hits zero
  const [isTimeOut, setIsTimeOut] = useState(false);
  

  // ============================================================================
  // ALGORITHMIC PROGRESSION MATRIX
  // ============================================================================
  const { gridSize, difficulty } = useMemo(() => {
    let currentDifficulty = "easy";
    let tierRelativeLevel = level;

    if (level <= 160) {
      // Tier 1: Easy (Levels 1 - 160) -> 5x5 up to 12x12
      currentDifficulty = "easy";
      tierRelativeLevel = level;
    } else if (level <= 320) {
      // Tier 2: Medium (Levels 161 - 320) -> Resets to 5x5 up to 12x12
      currentDifficulty = "medium";
      tierRelativeLevel = level - 160;
    } else {
      // Tier 3: Hard Endless (Levels 321+) -> Resets to 5x5 and cycles sizes every 160 stages
      currentDifficulty = "hard";
      tierRelativeLevel = ((level - 321) % 160) + 1;
    }

    // Every 20 levels inside the current difficulty tier, increment grid scale by 1
    const sizeBracket = Math.floor((tierRelativeLevel - 1) / 20);
    const calculatedSize = 5 + sizeBracket;

    return { gridSize: calculatedSize, difficulty: currentDifficulty };
  }, [level]);

  // LOOK UP ALLOCATED DURATION LIMIT FOR DYNAMIC RENDER KEY BASES
  const levelDuration = useMemo(() => {
    return TIME_LIMITS[difficulty]?.[gridSize] || 60; // Fallback to 60s safety margin
  }, [gridSize, difficulty]);

  const puzzle = useMemo(() => {
    const { gridConfig, maxNum, start } = generateZipGridConfig(gridSize, difficulty);
    const scrambledGrid = ScrambledGridConfig(gridConfig, 0.8);
    return { scrambledGrid, maxNum, start };
  }, [gridSize, difficulty, level]);

// const { gridConfig, maxNum, start } = generateZipGridConfig(gridSize, difficulty);
//   const scrambledGrid =  ScrambledGridConfig(gridConfig, 0.8);

    useEffect(() => {
        setIsTimerActive(false);
        setIsTimeOut(false);
      }, [gridSize, difficulty, level]);

 return (
    <div className="game-wrapper">
      {/* ============================================================================
          DYNAMIC RESPONSIVE GAME STATUS DASHBOARD
         ============================================================================ */}
      <div className="game-dashboard-header">
        {/* Dynamic difficulty badge that colors itself based on current selection state */}
        <div className={`dashboard-badge ascent-theme ${difficulty}`}>
          Level<span className="badge-meta"> {level}</span>
        </div>
        
        {/* Placeholder structural timer block */}
        <ReverseTimer 
          key={`${level}-${refreshKey}`} 
          duration={levelDuration}
          isActive={isTimerActive} 
          onStop={(formattedTimeSpent, secondsLeft) => {
            setFinalTime(formattedTimeSpent);
            const scorePercentage = secondsLeft / levelDuration;
            const earned = Math.max(10, Math.round(scorePercentage * 100));
            setPointsEarned(earned);
            setTotalPoints((prev) => prev + earned);
          }}
          onTimeOut={() => {
            setIsTimerActive(false);
            setIsTimeOut(true); // Triggers the Try Again overlay locally
          }}
        />
        {/* Points display label */}
        <div className="dashboard-points">
          Points: <strong>{totalPoints}</strong>
        </div>
      </div>
      {/* Interactive Board Rendering */}
      <RotateBoard 
                   key={`${level}-${refreshKey}`}
                   gridConfig={puzzle.scrambledGrid} 
                   maxNum={puzzle.maxNum} 
                   start={puzzle.start} 
                   finalTime={finalTime}
                   pointsEarned={pointsEarned}
                   totalPoints={totalPoints}   
                   isTimeOut={isTimeOut}
                   onStartGame={() => {
                    if (!isTimeOut) setIsTimerActive(true);
                   }}
                   onWinGame={() => setIsTimerActive(false)}
                   onNextLevel={() => setLevel((prev) => prev + 1)}
                   onTryAgain={() => {
                    setIsTimeOut(false);
                    setRefreshKey((prev) => prev + 1); // Bumps layout keys to force clear states
                  }}
      />

      {/* Scoped CSS Styles to keep selectors neatly aligned underneath the board */}
      <style>{`
        .game-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          // background-color: #f8fafc;
          min-height: auto;
          box-sizing: border-box;
        }

     /* --- NEW GAME DASHBOARD LAYER STYLE TARGETS --- */
        .game-dashboard-header {
          position: relative; /* 1. CRITICAL: Serves as the anchor for our absolute element */
          display: flex;
          justify-content: space-between; /* 2. Pins the badge to the far left and points to the far right */
          align-items: center;
          width: 100%;
          max-width: 450px;
          padding: 0 16px;
          margin-top: 10px;
          margin-bottom: 6px;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, sans-serif;
          user-select: none;
        }

        .dashboard-badge {
          font-weight: 700;
          font-size: 14px;
          text-transform: capitalize;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        /* Strategic State Color Codes mapping directly to current puzzle state */
        .dashboard-badge.easy { color: #008000; }
        .dashboard-badge.medium { color: #d97706; }
        .dashboard-badge.hard { color: #ef4444; }
        .dashboard-badge.ascent-theme {
          color: #6366f1; 
        }

        .dashboard-timer {
          /* 3. BULLETPROOF FIX: Completely untethers the timer from flex constraints */
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%); /* Keeps it dead-locked in the mathematical center */
          
          font-variant-numeric: tabular-nums; 
          font-weight: 600;
          color: #475569;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .timer-icon {
          font-size: 14px;
        }

        .dashboard-points {
          font-size: 15px;
          color: #334155;
          text-align: right;
          white-space: nowrap;
        }

        .dashboard-points strong {
          font-weight: 800;
          color: #0f172a;
        }

        .App.theme-dark .dashboard-points {
          color: var(--ink-soft);
        }

        .App.theme-dark .dashboard-points strong {
          color: var(--ink);
        }

        .controls-container {
          width: 100%;
          max-width: 450px; /* Locks proportions perfectly below the board frame */
          padding: 0 20px;
          box-sizing: border-box;
          margin-bottom: 40px;
        }

        .control-section {
          margin-top: 20px;
          text-align: center;
        }

        .control-heading {
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          user-select: none;
        }

        /* Reusable Responsive Button Track Grids */
        .button-grid {
          display: grid;
          gap: 8px;
          width: 100%;
        }

        .diff-cols {
          grid-template-columns: repeat(3, 1fr); /* 3 column setup */
        }

        .size-cols {
          grid-template-columns: repeat(4, 1fr); /* 4 column setups */
        }

        .split-row {
          margin-top: 8px; /* Adds space between row 1 and row 2 of grid sizes */
        }

        /* Interactive Premium Button Styling */
        .control-btn {
          background-color: #ffffff;
          border: 2px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 0;
          font-weight: 700;
          font-size: 14px;
          color: #334155;
          cursor: pointer;
          user-select: none;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .control-btn:hover {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }

        .control-btn:active {
          transform: scale(0.96);
        }

        /* Active highlight status styling (emerald matched themes) */
        .control-btn.active {
          background-color: #06b6d4;
          border-color: #00a490;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 189, 165, 0.25);
        }

        .capitalize {
          text-transform: capitalize;
        }

        @media (max-width: 480px) {
          .controls-container {
            padding: 0 12px;
          }
          .control-heading {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .control-btn {
            padding: 8px 0;
            font-size: 12px;
            border-radius: 8px;
            border-width: 1.5px;
          }
          .button-grid {
            gap: 6px;
          }
          .split-row {
            margin-top: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ZipFlipAscent;