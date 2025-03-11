import React from 'react';

const ScoreBoard = ({ score, targetScore }) => {
  return (
    <div className="score-board">
      <div className="current-score">Score: {score}</div>
      <div className="target-score">Target: {targetScore}</div>
    </div>
  );
};

export default ScoreBoard; 