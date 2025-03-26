import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './game/GameBoard';
import ScoreBoard from './game/ScoreBoard';
import Timer from './game/Timer';
import HighScores from './highscores/HighScores';
import useGameState from '../hooks/useGameState';
import { saveHighScore } from '../services/firestoreService';
import ScoreManager from './highscores/ScoreManager';

const GAME_DURATION = 60; // 60 seconds
const TARGET_SCORE = 500;

const Game = () => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const {
    score,
    timeLeft,
    isGameActive,
    gameObjects,
    hookPosition,
    catchAnimation,
    lastCaughtItem,
    startGame,
    dropHook,
    updateScore,
    endGame
  } = useGameState(GAME_DURATION);

  const handleEndGame = useCallback(async () => {
    if (isGameActive) {
      endGame();
      setGameOver(true);
    }
  }, [isGameActive, endGame]);

  // Save score when game ends
  const handleSaveScore = async () => {
    await saveHighScore(score, playerName || 'Anonymous');
    setShowHighScores(false);
    setGameOver(false);
    setPlayerName('');
  };

  // End game when time runs out
  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      handleEndGame();
    }
  }, [timeLeft, isGameActive, handleEndGame]);

  // Check if target score is reached
  useEffect(() => {
    if (score >= TARGET_SCORE && isGameActive) {
      handleEndGame();
    }
  }, [score, isGameActive, handleEndGame]);

  // Handle starting a new game
  const handleStartGame = () => {
    setShowHighScores(false);
    setGameOver(false);
    startGame();
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <div className="game-container">
      {!gameOver ? (
        <>
          <div className="game-info">
            <ScoreBoard score={score} targetScore={TARGET_SCORE} />
            <Timer timeLeft={timeLeft} />
          </div>
          <GameBoard
            gameObjects={gameObjects}
            hookPosition={hookPosition}
            catchAnimation={catchAnimation}
            lastCaughtItem={lastCaughtItem}
            dropHook={dropHook}
          />
          {!isGameActive && (
            <button className="start-button" onClick={handleStartGame}>
              {timeLeft === GAME_DURATION ? 'Start Game' : 'Play Again'}
            </button>
          )}
        </>
      ) : (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
          />
          <button onClick={handleSaveScore} className="save-score-button">
            Save Score
          </button>
          <HighScores />
          <button onClick={resetGame} className="play-again-button">
            Play Again Without Saving
          </button>
        </div>
      )}

      {!isGameActive && (
        <ScoreManager />
      )}
    </div>
  );
};

export default Game; 