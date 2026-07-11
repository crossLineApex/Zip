import PuzzleCard from '../components/PuzzleCard.jsx';
import DailyZipFlipPuzzle from '../components/DailyZipFlipPuzzle.jsx';
import DailyZipDotPuzzle from '../components/DailyZipDotPuzzle.jsx';

const DailyPuzzleGrid = ({view, onPuzzleSelect}) => (
  <div className="daily-grid" id="daily">
    <DailyZipFlipPuzzle view = {view} onPuzzleSelect = {onPuzzleSelect}/>
    <DailyZipDotPuzzle view = {view} onPuzzleSelect = {onPuzzleSelect}/>
  </div>
);

export default DailyPuzzleGrid;
