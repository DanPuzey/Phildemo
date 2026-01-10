import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const STORAGE_KEY = 'pool-scoreboard-state';

interface FrameRecord {
  winner: 1 | 2;
  time: number;
  player1Name: string;
  player2Name: string;
}

export default function App() {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [frameHistory, setFrameHistory] = useState<FrameRecord[]>([]);
  const [showStats, setShowStats] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setPlayer1Name(state.player1Name || 'Player 1');
        setPlayer2Name(state.player2Name || 'Player 2');
        setPlayer1Score(state.player1Score || 0);
        setPlayer2Score(state.player2Score || 0);
        setFrameHistory(state.frameHistory || []);

        // If timer was running, calculate elapsed time
        if (state.isTimerRunning && state.timerStartTime) {
          const elapsed = Math.floor((Date.now() - state.timerStartTime) / 1000);
          setSeconds(elapsed);
          setIsTimerRunning(true);
          setTimerStartTime(state.timerStartTime);
        } else {
          setSeconds(state.seconds || 0);
          setIsTimerRunning(false);
          setTimerStartTime(null);
        }
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    const state = {
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      seconds,
      isTimerRunning,
      timerStartTime,
      frameHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [player1Name, player2Name, player1Score, player2Score, seconds, isTimerRunning, timerStartTime, frameHistory, isInitialized]);

  // Timer interval
  useEffect(() => {
    if (isTimerRunning && timerStartTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        setSeconds(elapsed);
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
  }, [isTimerRunning, timerStartTime]);

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

    // Record the frame in history
    const frameRecord: FrameRecord = {
      winner: player,
      time: seconds,
      player1Name,
      player2Name,
    };
    setFrameHistory(prev => [...prev, frameRecord]);

    setIsTimerRunning(false);
    setTimerStartTime(null);
  };

  const handleTimerStart = () => {
    const now = Date.now();
    setSeconds(0);
    setTimerStartTime(now);
    setIsTimerRunning(true);
  };

  const handleReset = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setTimerStartTime(null);
    setFrameHistory([]);
    setShowStats(false);
    localStorage.removeItem(STORAGE_KEY);
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

        <div className="action-buttons">
          <button
            className="stats-btn"
            onClick={() => setShowStats(true)}
            aria-label="View statistics"
            disabled={frameHistory.length === 0}
          >
            Stats
          </button>
          <button
            className="reset-btn"
            onClick={handleReset}
            aria-label="Reset game"
          >
            New Game
          </button>
        </div>
      </div>

      {showStats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Frame Statistics</h2>
              <button
                className="modal-close"
                onClick={() => setShowStats(false)}
                aria-label="Close statistics"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {frameHistory.length === 0 ? (
                <p className="no-data">No frames recorded yet</p>
              ) : (
                <div className="frame-list">
                  {frameHistory.map((frame, index) => (
                    <div key={index} className="frame-record">
                      <div className="frame-number">Frame {index + 1}</div>
                      <div className="frame-winner">
                        Winner: {frame.winner === 1 ? frame.player1Name : frame.player2Name}
                      </div>
                      <div className="frame-time">{formatTime(frame.time)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
