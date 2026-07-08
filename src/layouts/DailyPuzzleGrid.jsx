import PuzzleCard from '../components/PuzzleCard.jsx';
import DailyZipFlipPuzzle from '../components/DailyZipFlipPuzzle.jsx';
import DailyZipDotPuzzle from '../components/DailyZipDotPuzzle.jsx';

const DailyPuzzleGrid = () => (
  <div className="daily-grid" id="daily">
    <DailyZipFlipPuzzle/>
    <DailyZipDotPuzzle/>
  </div>
);

export default DailyPuzzleGrid;
