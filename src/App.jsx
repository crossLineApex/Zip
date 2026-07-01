import { useState } from 'react'
import './App.css'
import ZipPuzzle from "./components/ZipPuzzle.jsx";
function App() {

  return (
    <div className="App">
      <h1>Zip Scrambler</h1>
      <h3>Let the Zip Flow</h3>
      <div className="playDiv">
        <div>
          <ZipPuzzle />
        </div>
      </div>
    </div>
  );
}

export default App
