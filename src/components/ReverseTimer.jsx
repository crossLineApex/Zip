import React, { useState, useEffect, useRef } from "react";

const ReverseTimer = ({ duration, isActive, onStop, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeLeftRef = useRef(duration);
  
  const hasFiredScoreRef = useRef(false);
  const hasStartedRef = useRef(false); 

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (isActive) {
      hasFiredScoreRef.current = false;
      hasStartedRef.current = true; 
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // ============================================================================
  // TIMEOUT INTERCEPTOR
  // Fires upwards to the parent layout the exact millisecond the clock hits zero
  // ============================================================================
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      if (onTimeOut) onTimeOut();
    }
  }, [timeLeft, isActive, onTimeOut]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Broadcast results upwards exactly once when victory halts the engine
  useEffect(() => {
    if (!isActive && hasStartedRef.current && !hasFiredScoreRef.current) {
      // ⚡ FIX: Only run score distribution if the player stopped the clock BEFORE timing out
      if (timeLeftRef.current > 0) {
        if (onStop) {
          hasFiredScoreRef.current = true;
          const timeSpentSeconds = duration - timeLeftRef.current;
          onStop(formatTime(timeSpentSeconds), timeLeftRef.current); 
        }
      }
    }
  }, [isActive, onStop, duration]);

  return (
    <div className="dashboard-timer">
      <span className="timer-icon">⏳</span> {formatTime(timeLeft)}
    </div>
  );
};

export default ReverseTimer;