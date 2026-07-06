import React, { useState, useEffect, useRef } from "react";

const Timer = ({ isActive, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(0);
  
  // 1. THE GATEKEEPER: Tracks whether we have already submitted scores for this level
  const hasFiredScoreRef = useRef(false); 

  // Sync the raw numeric seconds ref
  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  // Reset our gatekeeper latch if the clock is ever started back up
  useEffect(() => {
    if (isActive) {
      hasFiredScoreRef.current = false;
    }
  }, [isActive]);

  // Interval engine handler
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Completion broadcasting effect routine
  useEffect(() => {
    // 2. CORRECTION: Only enter this block if the gatekeeper latch is open (!hasFiredScoreRef.current)
    if (!isActive && secondsRef.current > 0 && !hasFiredScoreRef.current) {
      if (onStop) {
        hasFiredScoreRef.current = true; // 3. LOCK THE GATE IMMEDIATELY: Prevents re-render loops from entering
        onStop(formatTime(secondsRef.current), secondsRef.current);
      }
    }
  }, [isActive, onStop]);

  return (
    <div className="dashboard-timer">
      <span className="timer-icon">⏱️</span> {formatTime(seconds)}
    </div>
  );
};

export default Timer;