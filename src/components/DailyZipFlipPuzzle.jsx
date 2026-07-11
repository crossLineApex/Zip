import React, { useState, useMemo } from "react";
import RotateBoard from "./RotateBoard.jsx";
import scrambleGridConfig from "../assets/dailyScrambledGridConfig.js";
import {getDailyPuzzleParameters, generateZipGridConfig} from "../assets/dailyLevelGenerator.js";
import Timer from "./Timer.jsx";
import './gameStyles.css';

const DailyZipFlipPuzzle = ({view, onPuzzleSelect}) => {
  // const [difficulty, setDifficulty] = useState("easy"); // we will not use
  // const [gridSize, setGridSize] = useState(5);// we will not use
  const [refreshKey, setRefreshKey] = useState(1);// might not use it
  //Single trigger state to activate the clock
  const [isTimerActive, setIsTimerActive] = useState(false);
  //Holds the frozen victory time string
  const [finalTime, setFinalTime] = useState("");
  // NEW SCORE ENGINE TRACK STATE VARIABLES
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const puzzle = useMemo(() => {

    const { zipFlip } = getDailyPuzzleParameters();

    const { gridConfig, maxNum, start } = generateZipGridConfig(zipFlip.gridSize, zipFlip.difficulty, zipFlip.seed);
    const scrambledGrid = scrambleGridConfig(gridConfig, 0.9, zipFlip.seed);

    return { scrambledGrid, maxNum, start, difficulty: zipFlip.difficulty, gridSize: zipFlip.gridSize };
    
  }, []);

    // useEffect(() => {
    //     setIsTimerActive(false);
    //   }, [gridSize, difficulty, refreshKey]);

 return (
    <div className="daily-puzzle-shell">
      <div className="game-wrapper">
      {/* ============================================================================
          DYNAMIC RESPONSIVE GAME STATUS DASHBOARD
         ============================================================================ */}
      <div className="game-dashboard-header">
        {/* Dynamic difficulty badge that colors itself based on current selection state */}
        <div className='dashboard-badge daily'>
          Zip Flip #daily
        </div>
        
        {/* Placeholder structural timer block */}
          <Timer 
            // key={`${gridSize}-${difficulty}-${refreshKey}`} 
            isActive={isTimerActive} 
            onStop={(timeString, rawSeconds) => {
              setFinalTime(timeString);
              
              // DYNAMIC PERFORMANCE FORMULA ENGINE CALCULATIONS
              let diffMultiplier = 1;
              if (puzzle.difficulty === "medium") diffMultiplier = 1.5;
              if (puzzle.difficulty === "hard") diffMultiplier = 2;
              
              const penalty = rawSeconds / (puzzle.gridSize * diffMultiplier);
              const earned = Math.max(10, Math.round(100 - penalty));
              
              setPointsEarned(earned);
              setTotalPoints((prev) => prev + earned); // Appends earnings to total balance
          }}
        />
        {/* Points display label */}
        <div className="dashboard-points">
          Points: <strong>{totalPoints}</strong>
        </div>
      </div>
      {/* Interactive Board Rendering */}
      <RotateBoard gridConfig={puzzle.scrambledGrid} 
                   maxNum={puzzle.maxNum} 
                   start={puzzle.start} 
                   finalTime={finalTime}
                   pointsEarned={pointsEarned}
                   totalPoints={totalPoints}   
                   onStartGame={() => setIsTimerActive(true)}
                   onWinGame={() => setIsTimerActive(false)}
                   onNextLevel={() => setRefreshKey((prev) => prev + 1)}
                   view={view}
                   onPuzzleSelect = {onPuzzleSelect}
      />

      {/* ============================================================================
         RESPONSIVE CONTROL SELECTION ENGINE
         ============================================================================ */}
      </div>
    </div>
  );
};

export default DailyZipFlipPuzzle;