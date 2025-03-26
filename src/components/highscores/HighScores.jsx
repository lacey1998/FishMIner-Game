import React, { useState, useEffect } from 'react';
import { getHighScores } from '../../services/firestoreService';


const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHighScores = async () => {
      try {
        setLoading(true);
        const scores = await getHighScores(10);
        setHighScores(scores);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load high scores', err);
        setError('Failed to load high scores. Please try again later.');
        setLoading(false);
      }
    };

    loadHighScores();
  }, []);

  if (loading) return <div className="high-scores-loading">Loading high scores...</div>;
  if (error) return <div className="high-scores-error">{error}</div>;

  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      {highScores.length === 0 ? (
        <p>No scores yet. Be the first to set a high score!</p>
      ) : (
        <ul className="high-scores-list">
          {highScores.map((score, index) => (
            <li key={score.id} className="high-score-item">
              <span className="high-score-rank">#{index + 1}</span>
              <span className="high-score-name">{score.playerName}</span>
              <span className="high-score-points">{score.score} points</span>
              <span className="high-score-date">
                {new Date(score.timestamp).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HighScores; 