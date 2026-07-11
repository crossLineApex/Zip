import { useEffect } from "react";

const ModeSelectionPanel = ({ selectedPuzzle, selectedMode, onSelectMode }) => {
  const puzzleLabel = selectedPuzzle === 'dot' ? 'Zip Dot' : 'Zip Flip';
  useEffect(() => {
    onSelectMode('sandbox');
  },[])
  return (
    <div className="mode-selection-panel">
      <div className="mode-selection-card">
        <p className="mode-selection-label">Choose a mode for {puzzleLabel}</p>
        <div className="mode-choice-buttons">
          <button
            type="button"
            className={`mode-choice-btn ${selectedMode === 'sandbox' ? 'active' : ''}`}
            onClick={() => onSelectMode('sandbox')}
          >
            Sandbox
          </button>
          <button
            type="button"
            className={`mode-choice-btn ${selectedMode === 'ascent' ? 'active' : ''}`}
            onClick={() => onSelectMode('ascent')}
          >
            Ascent
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionPanel;
