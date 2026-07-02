import React, { useState } from "react";
import RotateBoard from "./RotateBoard.jsx";
import ScrambledGridConfig from "../assets/ScrambledGridConfig.js";
import generateZipGridConfig from "../assets/levelGenerator.js";

const ZipPuzzle = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [gridSize, setGridSize] = useState(5);
  const [refreshKey, setRefreshKey] = useState(1);

const { gridConfig, maxNum, start } = generateZipGridConfig(gridSize, difficulty);
  const scrambledGrid =  ScrambledGridConfig(gridConfig, 0.8);

 return (
    <div className="game-wrapper">
      {/* Interactive Board Rendering */}
      <RotateBoard gridConfig={scrambledGrid} 
                   maxNum={maxNum} start={start} 
                   onNextLevel={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* ============================================================================
         RESPONSIVE CONTROL SELECTION ENGINE
         ============================================================================ */}
      <div className="controls-container">
        
        {/* ROW 1: DIFFICULTY CONTROLS */}
        <div className="control-section">
          <div className="control-heading">Choose Difficulty</div>
          <div className="button-grid diff-cols">
            {["easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                className={`control-btn capitalize ${difficulty === diff ? "active" : ""}`}
                onClick={() => setDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 2: GRID SIZE CONTROLS */}
        <div className="control-section">
          <div className="control-heading">Choose Grid Size</div>
          
          {/* Row 2 - First Row of Options (5x5 to 8x8) */}
          <div className="button-grid size-cols">
            {[5, 6, 7, 8].map((size) => (
              <button
                key={size}
                className={`control-btn ${gridSize === size ? "active" : ""}`}
                onClick={() => setGridSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          {/* Row 2 - Second Row of Options (9x9 to 12x12) */}
          <div className="button-grid size-cols split-row">
            {[9, 10, 11, 12].map((size) => (
              <button
                key={size}
                className={`control-btn ${gridSize === size ? "active" : ""}`}
                onClick={() => setGridSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </div>

      </div>

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

export default ZipPuzzle;