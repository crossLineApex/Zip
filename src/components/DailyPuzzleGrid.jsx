import PuzzleCard from './PuzzleCard.jsx';

const DailyPuzzleGrid = () => (
  <div className="daily-grid" id="daily">
    <PuzzleCard
      variant="a"
      label="Zip Flip"
      puzzleNumber="Puzzle #147"
      path="M20,20 L20,74 L74,74 L74,182 L128,182 L128,128 L182,128 L182,20"
      dots={[
        { x: 20, y: 20, label: '1' },
        { x: 128, y: 182, label: '2' },
        { x: 182, y: 20, label: '3' },
      ]}
      difficulty={2}
      streak="12-day streak"
      buttonLabel="Play Zip Flip"
    />

    <PuzzleCard
      variant="b"
      label="Zip Dot"
      puzzleNumber="Puzzle #148"
      path="M20,182 L74,182 L74,74 L128,74 L128,20 L182,20 L182,128"
      dots={[
        { x: 20, y: 182, label: '1' },
        { x: 74, y: 74, label: '2' },
        { x: 182, y: 128, label: '3' },
      ]}
      difficulty={3}
      streak="8-day streak"
      buttonLabel="Play Zip Dot"
    />
  </div>
);

export default DailyPuzzleGrid;
