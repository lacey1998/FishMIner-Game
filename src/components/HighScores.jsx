import React, { useState, useEffect } from 'react';
import { getHighScores } from '../services/firestoreService';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const loadHighScores = async () => {
      const scores = await getHighScores();
      setHighScores(scores);
    };
    loadHighScores();
  }, []);

  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      <div className="scores-list">
        {highScores.map((score, index) => (
          <div key={score.id} className="score-item">
            <span className="rank">#{index + 1}</span>
            <span className="player">{score.playerName}</span>
            <span className="score">{score.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighScores; 