import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000) as unknown as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleScore = (player: 1 | 2) => {
    if (player === 1) {
      setPlayer1Score(s => s + 1);
    } else {
      setPlayer2Score(s => s + 1);
    }
    setIsTimerRunning(false);
  };

  const handleTimerStart = () => {
    setSeconds(0);
    setIsTimerRunning(true);
  };

  const handleReset = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <div className="app">
      <div className="scoreboard">
        <div className="timer-section">
          <div className="timer">{formatTime(seconds)}</div>
          {!isTimerRunning && (
            <button
              className="timer-btn"
              onClick={handleTimerStart}
              aria-label="Start timer"
            >
              Start Timer
            </button>
          )}
        </div>

        <div className="players">
          <div className="player">
            <input
              type="text"
              className="player-name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              aria-label="Player 1 name"
            />
            <div className="score">{player1Score}</div>
            <button
              className="score-btn"
              onClick={() => handleScore(1)}
              aria-label={`Increment ${player1Name} score`}
            >
              + Frame
            </button>
          </div>

          <div className="vs">VS</div>

          <div className="player">
            <input
              type="text"
              className="player-name"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              aria-label="Player 2 name"
            />
            <div className="score">{player2Score}</div>
            <button
              className="score-btn"
              onClick={() => handleScore(2)}
              aria-label={`Increment ${player2Name} score`}
            >
              + Frame
            </button>
          </div>
        </div>

        <button
          className="reset-btn"
          onClick={handleReset}
          aria-label="Reset game"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
