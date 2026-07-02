import { useState } from 'react';
import './App.css';
import Header from './layouts/Header.jsx';
import SectionHeading from './layouts/SectionHeading.jsx';
import DailyPuzzleGrid from './components/DailyPuzzleGrid.jsx';
import ModeCard from './layouts/ModeCard.jsx';
import FAQItem from './layouts/FAQItem.jsx';
import ModeSelectionPanel from './layouts/ModeSelectionPanel.jsx';
import SelectionStatus from './layouts/SelectionStatus.jsx';

function App() {
  const [view, setView] = useState('daily');
  const [selectedPuzzle, setSelectedPuzzle] = useState('flip');
  const [selectedMode, setSelectedMode] = useState('sandbox');

  const handlePuzzleSelect = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setView('mode');
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const resetToDaily = () => {
    setView('daily');
    setSelectedPuzzle('flip');
    setSelectedMode('sandbox');
  };

  return (
    <div className="App">
      <div className="bg-fade"></div>
      <Header onPuzzleSelect={handlePuzzleSelect} selectedPuzzle={selectedPuzzle} onBrandClick={resetToDaily} />

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
              <DailyPuzzleGrid />
            ) : (
              <div className="selection-view">
                <ModeSelectionPanel
                  selectedPuzzle={selectedPuzzle}
                  selectedMode={selectedMode}
                  onSelectMode={handleModeSelect}
                />
                <div className="selection-status-row">
                  <SelectionStatus
                    label="Current puzzle and puzzle"
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
                description="Unlimited, freshly generated puzzles at whatever difficulty and grid size you choose. No streaks, no pressure."
                ctaA="Try Sandbox · Flip"
                ctaB="Try Sandbox · Dot"
                icon={
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="18" height="18" rx="3" stroke="var(--zipa)" stroke-width="1.6"/>
                    <path d="M6 11h10M11 6v10" stroke="var(--zipa)" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                }
              />
              <ModeCard
                title="Ascent"
                description="A fixed run of levels that gets harder as you climb. Clear one to unlock the next — a real sense of progress!"
                ctaA="Try Ascent · Flip"
                ctaB="Try Ascent · Dot"
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

        <section id="how-to-play">
          <div className="wrap">
            <SectionHeading
              eyebrow="How to play"
              title="Connect every cell in order"
              description="Follow the numbered path without breaking the line. The puzzle is solved when the route is complete and continuous."
            />
            <div className="steps">
              <div className="step-card">
                <div className="step-num">01 / Start</div>
                <div className="step-board">
                  <svg viewBox="0 0 140 140" aria-hidden="true">
                    <rect x="10" y="10" width="120" height="120" rx="16" fill="#fff" />
                    <circle cx="36" cy="36" r="8" fill="#4A4FE0" />
                    <circle cx="104" cy="104" r="8" fill="#1E8F6B" />
                  </svg>
                </div>
                <h4>Begin with the first number</h4>
                <p>Choose the starting node and trace outward from there.</p>
              </div>
              <div className="step-card">
                <div className="step-num">02 / Trace</div>
                <div className="step-board">
                  <svg viewBox="0 0 140 140" aria-hidden="true">
                    <rect x="10" y="10" width="120" height="120" rx="16" fill="#fff" />
                    <path d="M40 40 L70 40 L70 100 L100 100" stroke="#4A4FE0" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
                <h4>Draw one continuous line</h4>
                <p>Each move must connect neatly to the next cell in sequence.</p>
              </div>
              <div className="step-card">
                <div className="step-num">03 / Check</div>
                <div className="step-board">
                  <svg viewBox="0 0 140 140" aria-hidden="true">
                    <rect x="10" y="10" width="120" height="120" rx="16" fill="#fff" />
                    <path d="M40 70 L70 70 L70 40" stroke="#1E8F6B" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
                <h4>Confirm each step</h4>
                <p>Use the numbering as a guide so the route stays in order.</p>
              </div>
              <div className="step-card">
                <div className="step-num">04 / Solve</div>
                <div className="step-board">
                  <svg viewBox="0 0 140 140" aria-hidden="true">
                    <rect x="10" y="10" width="120" height="120" rx="16" fill="#fff" />
                    <path d="M40 40 L40 100 L100 100 L100 40" stroke="#D89A1F" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
                <h4>Finish the full route</h4>
                <p>When every numbered node is linked, the puzzle is complete.</p>
              </div>
            </div>
          </div>
        </section>

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
                answer="Daily is one shared curated puzzle per day that everyone sees. Sandbox serves vetted puzzles on demand at any grid size from 5×5 all the way up to 12×12. Ascent starts easy and ramps through the same curated puzzle pool as you climb." />
              <FAQItem question="Is Anytime Zip free to play?" answer="100% free forever. There are no paywalls, locked levels, or premium restrictions blocking you from zipping grids."/>
              <FAQItem question="How many ways can I play Anytime Zip Game?" answer="You can either solve daiily puzzle on homepage, or select one of either Zip Flip or Zip Dot from the header with your choice of mode. Relieve your boredom!" />
              <FAQItem question="Do I need to create an account or sign up?" answer="No sign-up required. Play instantly. We believe great puzzle games shouldn't require a login form" />
              <FAQItem question="Can I play Anytime Zip offline?" answer="You only need an internet connection to load the initial website. Once the page is open, you can keep playing even if you lose service or hop onto an airplane or ride inside a tunnel."/>
              <FAQItem question="Does Anytime Zip on my phone?" answer="Yes! Anytime Zip is fully responsive and works on any device with a modern web browser. Play on your phone, tablet, or desktop." />
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
