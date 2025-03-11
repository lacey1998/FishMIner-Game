import React, { useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
import useGameState from '../hooks/useGameState';

const GAME_DURATION = 60; // 60 seconds
const TARGET_SCORE = 500;

const Game = () => {
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

  // End game when time runs out
  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  // Check if target score is reached
  useEffect(() => {
    if (score >= TARGET_SCORE && isGameActive) {
      endGame();
    }
  }, [score, isGameActive, endGame]);

  return (
    <div className="game-container">
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
        <button className="start-button" onClick={startGame}>
          {timeLeft === GAME_DURATION ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  );
};

export default Game;