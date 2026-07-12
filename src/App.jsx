import { useState, useEffect } from 'react';
import './App.css';
import Header from './layouts/Header.jsx';
import SectionHeading from './layouts/SectionHeading.jsx';
import DailyPuzzleGrid from './layouts/DailyPuzzleGrid.jsx';
import ModeCard from './layouts/ModeCard.jsx';
import FAQItem from './layouts/FAQItem.jsx';
import ModeSelectionPanel from './layouts/ModeSelectionPanel.jsx';
import SelectionStatus from './layouts/SelectionStatus.jsx';
import PuzzleCard from './components/PuzzleCard.jsx';


function App() {
  const [view, setView] = useState('daily');
  const [selectedPuzzle, setSelectedPuzzle] = useState('');
  const [selectedMode, setSelectedMode] = useState('sandbox');
  const [darkMode, setDarkMode] = useState(false);

  const handlePuzzleSelect = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setView('mode');
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const resetToDaily = () => {
    setView('daily');
    setSelectedPuzzle('');
    setSelectedMode('');
  };

  useEffect(() => {
  if (selectedPuzzle) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}, [selectedPuzzle]);

  return (
    <div className={`App ${darkMode ? 'theme-dark' : ''}`}>
      <div className="bg-fade"></div>
      <Header
        onPuzzleSelect={handlePuzzleSelect}
        selectedPuzzle={selectedPuzzle}
        onBrandClick={resetToDaily}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="eyebrow">No sign-up · Play Instantly</div>
            <h1>
              Two puzzles. One path each. <em>Every day.</em>
            </h1>
            <p className="lede">
              Anytime Zip is home to Zip Flip and Zip Dot — a pair of puzzles inspired from Linkedin's Zip daily puzzle. Each game challenges you in a unique sense. Play one or both, and see how far you can go.
            </p>

            {view === 'daily' ? (
              <DailyPuzzleGrid view={view} onPuzzleSelect={handlePuzzleSelect}/>
            ) : (
              <div className="selection-view">
                <ModeSelectionPanel
                  selectedPuzzle={selectedPuzzle}
                  selectedMode={selectedMode}
                  onSelectMode={handleModeSelect}
                />
                <div className="selection-status-row">
                  <SelectionStatus
                    label="Current puzzle and mode"
                    game={selectedPuzzle === 'dot' ? 'Zip Dot' : 'Zip Flip'}
                    mode={selectedMode === 'ascent' ? 'Ascent' : 'Sandbox'}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="divider" aria-hidden="true">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d="M0,20 C180,0 320,0 480,20 C640,40 780,40 960,20 C1060,8 1140,8 1200,20" fill="none" stroke="var(--zipa-line)" strokeWidth="2" />
          </svg>
        </div>

        <section id="games">
          <div className="wrap">
            <SectionHeading
              eyebrow="Games"
              title="Two games, one mind"
              description="Explore two distinct puzzle experiences with the same underlying logic."
            />
            <div className="modes-grid">
              <PuzzleCard
                variant="a"
                label="Zip Flip"
              />
              <PuzzleCard
                variant="b"
                label="Zip Dot"
              />
            </div>
          </div>
        </section>

        <div className="divider">
          <svg viewBox="0 0 1120 34" preserveAspectRatio="none">
            <path d="M0,17 L750,17 L780,30 L810,4 L840,17 L1120,17" fill="none" stroke="var(--line)" strokeWidth="2"/>
            <circle cx="0" cy="17" r="3.5" fill="var(--zipb)"/>
            <circle cx="1120" cy="17" r="3.5" fill="var(--zipa)"/>
          </svg>
        </div>

        <section id="modes">
          <div className="wrap">
            <SectionHeading
              eyebrow="Modes"
              title="Two ways to play, same board"
              description="Switch between calm and challenging runs depending on how much time you want to spend solving."
            />
            <div className="modes-note">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" />
                <path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeLinecap="round" />
              </svg>
              <span>Each mode keeps the same core logic but changes the pace and structure.</span>
            </div>
            <div className="modes-grid">
              <ModeCard
                title="Sandbox"
                description="Unlimited, freshly generated puzzles at Easy, Medium and Hard difficulty with any grid size from 5 x 5 to 10 x 10 you choose. No streaks, no pressure."
                icon={
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="18" height="18" rx="3" stroke="var(--zipa)" strokeWidth="1.6"/>
                    <path d="M6 11h10M11 6v10" stroke="var(--zipa)" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                }
              />
              <ModeCard
                title="Ascent"
                description="A fixed run of levels that gets harder as you climb. Ohh and the clock is ticking. Clear one level to unlock the next — a real sense of progress!"
                icon={
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M4 17.5L9 9L12.5 12.5L18 4" stroke="var(--zipa)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="18" cy="4" r="2" fill="var(--zipa)" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        <div className="divider">
          <svg viewBox="0 0 1120 34" preserveAspectRatio="none">
            <path d="M0,17 L750,17 L780,30 L810,4 L840,17 L1120,17" fill="none" stroke="var(--line)" strokeWidth="2"/>
            <circle cx="0" cy="17" r="3.5" fill="var(--zipb)"/>
            <circle cx="1120" cy="17" r="3.5" fill="var(--zipa)"/>
          </svg>
        </div>

        <section id="how-to-play">
          <div className="wrap">
            <SectionHeading
              eyebrow="How to play"
              title="Four Rules, one path"
              description="Both Zip Flip and Zip Dot follow the same core rules — only the grid layouts differ."
            />
            <div className="steps">
                <div className="step-card">
                  <span className="step-num">01</span>
                  <div className="step-board">
                    <svg viewBox="0 0 125 125" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#fff" strokeWidth="1">
                        <line x1="10" y1="10" x2="115" y2="10"></line>
                        <line x1="10" y1="45" x2="115" y2="45"></line>
                        <line x1="10" y1="80" x2="115" y2="80"></line>
                        <line x1="10" y1="115" x2="115" y2="115"></line>
                        
                        <line x1="10" y1="10" x2="10" y2="115"></line>
                        <line x1="45" y1="10" x2="45" y2="115"></line>
                        <line x1="80" y1="10" x2="80" y2="115"></line>
                        <line x1="115" y1="10" x2="115" y2="115"></line>
                      </g>

                      <path d="M27.5,27.5 L97.5,27.5 L97.5,62.5 L27.5,62.5 L27.5,97.5 L97.5,97.5" 
                            stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>

                      <circle cx="27.5" cy="27.5" r="9" fill="#000"></circle>
                      <text x="27.5" y="31" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">1</text>

                      <circle cx="62.5" cy="62.5" r="9" fill="#000"></circle>
                      <text x="62.5" y="66" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">2</text>

                      <circle cx="97.5" cy="97.5" r="9" fill="#000"></circle>
                      <text x="97.5" y="101" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#fff">3</text>
                    </svg>

                  </div>
                  <h4>Connect in order</h4>
                  <p>Only one line starting from 1 → 2 → 3, and so on, in numerical order, passing through each cell.</p>
                </div>

                <div className="step-card">
                  <span className="step-num">02</span>
                  <div className="step-board">
                    <svg viewBox="0 0 120 120">
                      <g stroke="#fff" strokeWidth="1">
                        <line x1="10" y1="10" x2="110" y2="10"/><line x1="10" y1="45" x2="110" y2="45"/>
                        <line x1="10" y1="80" x2="110" y2="80"/><line x1="10" y1="115" x2="110" y2="115"/>
                        <line x1="10" y1="10" x2="10" y2="115"/><line x1="45" y1="10" x2="45" y2="115"/>
                        <line x1="80" y1="10" x2="80" y2="115"/><line x1="110" y1="10" x2="110" y2="115"/>
                      </g>
                      <path d="M27.5,27.5 L62.5,27.5 L97.5,27.5 L97.5,62.5 L62.5,62.5 L27.5,62.5 L27.5,97.5 L62.5,97.5 L97.5,97.5" fill="none" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Fill every cell</h4>
                  <p>The path must pass through every square on the grid — no cell left empty.</p>
                </div>

                <div className="step-card">
                  <span className="step-num">03</span>
                  <div className="step-board">
                    <svg viewBox="0 0 120 120">
                      <g stroke="#fff" strokeWidth="1">
                        <line x1="10" y1="10" x2="110" y2="10"/><line x1="10" y1="45" x2="110" y2="45"/>
                        <line x1="10" y1="80" x2="110" y2="80"/><line x1="10" y1="115" x2="110" y2="115"/>
                        <line x1="10" y1="10" x2="10" y2="115"/><line x1="45" y1="10" x2="45" y2="115"/>
                        <line x1="80" y1="10" x2="80" y2="115"/><line x1="110" y1="10" x2="110" y2="115"/>
                      </g>
                      <path d="M27.5,27.5 L97.5,27.5 L97.5,62.5 L62.5,62.5 L62.5,97.5" fill="none" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M62.5,97.5 L62.5,27.5" fill="none" stroke="#D64545" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 6"/>
                      <circle cx="62.5" cy="62.5" r="6" fill="#D64545"/>
                    </svg>
                  </div>
                  <h4>Never cross yourself</h4>
                  <p>The line moves only up, down, left or right — and can't touch a cell it's already used.</p>
                </div>

                <div className="step-card">
                  <span className="step-num">04</span>
                  <div className="step-board">
                    <svg viewBox="0 0 120 120">
                      <rect x="10" y="10" width="100" height="100" rx="6" fill="var(--zipa-soft)"/>
                      <g stroke="#fff" strokeWidth="1">
                        <line x1="10" y1="10" x2="110" y2="10"/><line x1="10" y1="45" x2="110" y2="45"/>
                        <line x1="10" y1="80" x2="110" y2="80"/><line x1="10" y1="115" x2="110" y2="115"/>
                        <line x1="10" y1="10" x2="10" y2="115"/><line x1="45" y1="10" x2="45" y2="115"/>
                        <line x1="80" y1="10" x2="80" y2="115"/><line x1="110" y1="10" x2="110" y2="115"/>
                      </g>
                      <path d="M27.5,27.5 L62.5,27.5 L97.5,27.5 L97.5,62.5 L62.5,62.5 L27.5,62.5 L27.5,97.5 L62.5,97.5 L97.5,97.5" fill="none" stroke="var(--zipa)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="27.5" cy="27.5" r="6" fill="var(--zipa)"/>
                      <circle cx="97.5" cy="97.5" r="6" fill="var(--zipa)"/>
                    </svg>
                  </div>
                  <h4>Full grid, solved</h4>
                  <p>Once every cell is covered and the numbers connect in order, the puzzle is complete.</p>
                </div>
            </div>
          </div>
        </section>

        <div className="divider">
          <svg viewBox="0 0 1120 34" preserveAspectRatio="none">
            <path d="M0,17 L750,17 L780,30 L810,4 L840,17 L1120,17" fill="none" stroke="var(--line)" strokeWidth="2"/>
            <circle cx="0" cy="17" r="3.5" fill="var(--zipb)"/>
            <circle cx="1120" cy="17" r="3.5" fill="var(--zipa)"/>
          </svg>
        </div>

        <section id="faq">
          <div className="wrap">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions before you play"
              description="Everything you need to know about the daily puzzle format and flow."
            />
            <div className="faq-list">
              <FAQItem question="What is Anytime Zip?" answer="Anytime Zip is a casual, independent, free-to-play puzzle site featuring two unique path-building game modes: Zip Flip and Zip Dot. Merely inspired by Linkedin's Zip game, but with its own unique twist." />
              <FAQItem question="What's the difference between Daily, Sandbox, and Ascent modes?"
                answer="Daily is one shared curated puzzle per day that everyone sees. Sandbox serves vetted puzzles on demand at any grid size from 5×5 all the way up to 10×10. Ascent starts easy and ramps through the same curated puzzle pool as you climb." />
              <FAQItem question="Is Anytime Zip free to play?" answer="100% free. There are no paywalls, locked levels, or premium restrictions blocking you from solving puzzles."/>
              <FAQItem question="How many ways can I play Anytime Zip Game?" answer="You can either solve daily puzzles on homepage, or select one of either Zip Flip or Zip Dot from the header with your choice of mode. Relieve your boredom!" />
              <FAQItem question="Do I need to create an account or sign up?" answer="No sign-up required. Play instantly. We believe great puzzle games shouldn't require a login form" />
              <FAQItem question="Can I play Anytime Zip offline?" answer="You only need an internet connection to load the initial website. Once the page is open, you can keep playing even if you lose service or hop onto an airplane or ride inside a tunnel."/>
              <FAQItem question="Does Anytime Zip work on my phone?" answer="Yes! Anytime Zip is fully responsive and works on any device with a modern web browser. Play on your phone, tablet, or desktop." />
              <FAQItem question="How often are puzzles updated?" answer="A fresh puzzle arrives each day so there is always a new challenge to solve." />
              <FAQItem question="Is this the official LinkedIn Zip game?" answer="No. Anytime Zip is an independent project inspired by the original LinkedIn Zip game. It is not affiliated with LinkedIn or follows the same Zip puzzle solving mechanics." />
              <FAQItem question="Is my privacy protected?" answer="Yes. Anytime Zip does not collect any personal information or track your activity using cookies, sessions. You can solve puzzles without creating an account or providing any personal data." />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <svg className="brand-mark" width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" rx="7" fill="#fff" stroke="var(--line)" />
              <circle cx="8" cy="20" r="2.6" fill="var(--zipa)" />
              <circle cx="20" cy="8" r="2.6" fill="var(--zipb)" />
              <path d="M8 20 L8 14 L14 14 L14 8 L20 8" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="brand-name">anytime Zip</span>
            <div className="footer-fine">Built for daily puzzle runs</div>
          </div>
          <div className="footer-links">
            {/* <a href="#daily">Play</a>
            <a href="#modes">Modes</a>
            <a href="#faq">FAQ</a> */}
          </div>
          <div className="footer-fine">© 2026 anytime Zip. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
