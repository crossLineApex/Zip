import ZipPuzzle from "../components/ZipPuzzle.jsx";

const SelectionStatus = ({ label, mode, game }) => (
  <div className="selection-status-card">
    <span className="selection-status-label">{label}</span>
    <strong>{game}</strong>
    <strong>{mode}</strong>
  <ZipPuzzle/>
  </div>
);

export default SelectionStatus;
