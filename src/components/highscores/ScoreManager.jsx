import React, { useState, useEffect } from 'react';
import { 
  getHighScores, 
  updateScore, 
  deleteScore, 
  getScoreById 
} from '../../services/firestoreService';

const ScoreManager = () => {
  const [scores, setScores] = useState([]);
  const [editingScore, setEditingScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load scores
  const loadScores = async () => {
    try {
      setLoading(true);
      const fetchedScores = await getHighScores(100); // Get more scores for management
      setScores(fetchedScores);
      setError(null);
    } catch (err) {
      setError('Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  // Handle score update
  const handleUpdate = async (scoreId, newData) => {
    try {
      await updateScore(scoreId, newData);
      await loadScores(); // Reload scores after update
      setEditingScore(null);
      setError(null);
    } catch (err) {
      setError('Failed to update score');
    }
  };

  // Handle score deletion
  const handleDelete = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await deleteScore(scoreId);
        await loadScores(); // Reload scores after deletion
        setError(null);
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  if (loading) return <div>Loading scores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="score-manager">
      <h2>Score Management</h2>
      <div className="scores-list">
        {scores.map(score => (
          <div key={score.id} className="score-item">
            {editingScore === score.id ? (
              <div className="score-edit-form">
                <input
                  type="number"
                  defaultValue={score.score}
                  onChange={(e) => {
                    const newScore = parseInt(e.target.value);
                    if (!isNaN(newScore)) {
                      handleUpdate(score.id, { score: newScore });
                    }
                  }}
                />
                <button onClick={() => setEditingScore(null)}>Cancel</button>
              </div>
            ) : (
              <div className="score-display">
                <span>{score.playerName || 'Anonymous'}: {score.score}</span>
                <div className="score-actions">
                  <button onClick={() => setEditingScore(score.id)}>Edit</button>
                  <button onClick={() => handleDelete(score.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreManager; 