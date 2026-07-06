import ZipFlipSandbox from "../components/ZipFlipSandbox.jsx";
import ZipFlipAscent from "../components/ZipFlipAscent.jsx";
import ZipDotSandbox from "../components/ZipDotSandbox.jsx";
import ZipDotAscent from "../components/ZipDotAscent.jsx";

const SelectionStatus = ({ label, mode, game }) => (
  <div className="selection-status-card">
    <span className="selection-status-label">{label}</span>
    <strong>{game}</strong>
    <strong>{mode}</strong>
    {game === 'Zip Flip' && mode === 'Sandbox' && <ZipFlipSandbox/>}
    {game === 'Zip Flip' && mode === 'Ascent' && <ZipFlipAscent/>}
    {game === 'Zip Dot' && mode === 'Sandbox' && <ZipDotSandbox/>}
    {game === 'Zip Dot' && mode === 'Ascent' && <ZipDotAscent/>}
  </div>
);

export default SelectionStatus;
