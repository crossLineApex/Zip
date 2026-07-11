import React, {useState, useMemo} from "react";
import Board from "./Board.jsx";
import Timer from "./Timer.jsx";
import {getDailyPuzzleParameters, generateZipDotConfig} from "../assets/dailyLevelGenerator.js";
import convertToZipDot from "../assets/convertToZipDot.js";
import './gameStyles.css';

const DailyZipDotPuzzle = ({view, onPuzzleSelect}) => {
    const [difficulty, setDifficulty] = useState("easy"); // we will not use
    const [gridSize, setGridSize] = useState(5); // we will not use
    const [refreshKey, setRefreshKey] = useState(1);// might not use
    //Single trigger state to activate the clock
    const [isTimerActive, setIsTimerActive] = useState(false);
    //Holds the frozen victory time string
    const [finalTime, setFinalTime] = useState("");
    // NEW SCORE ENGINE TRACK STATE VARIABLES
    const [pointsEarned, setPointsEarned] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    
    const puzzle = useMemo(() => {
        const { zipDot } = getDailyPuzzleParameters();
        const { gridConfig, maxNum, start, transformedPath } = generateZipDotConfig(zipDot.gridSize, zipDot.difficulty, zipDot.seed);
        const originalBoard = [...gridConfig];
        const {dotGrid, initialDots, numberBarChoices} = convertToZipDot(gridConfig, maxNum);
        return { dotGrid, maxNum, start, initialDots, originalBoard, numberBarChoices, transformedPath, difficulty: zipDot.difficulty, gridSize: zipDot.gridSize };
    }, []);

    // useEffect(() => {
    //     setIsTimerActive(false);
    //     }, [gridSize, difficulty, refreshKey]);

  return (
    <div className="daily-puzzle-shell">
      <div className="game-wrapper">
        <div className="game-dashboard-header">
        {/* Dynamic difficulty badge that colors itself based on current selection state */}
            <div className='dashboard-badge daily'>
              Zip Dot #daily
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
        <Board
            gridConfig={puzzle.dotGrid}
            initialDots={puzzle.initialDots}
            numberBarChoices={puzzle.numberBarChoices || []}
            numberBarColumns={puzzle.numberBarChoices.length || 0}
            solutionMap={puzzle.transformedPath || {}}
            finalTime={finalTime}
            pointsEarned={pointsEarned}
            totalPoints={totalPoints}   
            onStartGame={() => setIsTimerActive(true)}
            onWinGame={() => setIsTimerActive(false)}
            onNextLevel={() => setRefreshKey((prev) => prev + 1)}
            view={view}
            onPuzzleSelect = {onPuzzleSelect}
         />
      </div>
    </div>

  );
};

export default DailyZipDotPuzzle;
