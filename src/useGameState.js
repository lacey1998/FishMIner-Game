import { useState, useEffect, useCallback } from 'react';

const INITIAL_OBJECTS = [
  { id: 1, type: 'fish', points: 50, position: { x: 100, y: 0 } },
  { id: 2, type: 'fish', points: 30, position: { x: 300, y: 0 } },
  { id: 3, type: 'garbage', points: -20, position: { x: 200, y: 0 } },
  { id: 4, type: 'mystery', points: 0, position: { x: 400, y: 0 } },
];

const LOCAL_STORAGE_KEY = 'fishMinerGameState';

const useGameState = (gameDuration) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameObjects, setGameObjects] = useState([]);
  const [hookPosition, setHookPosition] = useState(250); // Hook's X position
  const [hookDirection, setHookDirection] = useState(1); // 1 for right, -1 for left
  const [catchAnimation, setCatchAnimation] = useState(null); // To track catch animations
  const [lastCaughtItem, setLastCaughtItem] = useState(null); // To show feedback

  // Define board boundaries
  const MIN_POSITION = 20; // Minimum hook position (left edge + buffer)
  const MAX_POSITION = 460; // Maximum hook position (right edge - buffer)

  // Save game state to localStorage
  useEffect(() => {
    const gameState = { score, timeLeft };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [score, timeLeft]);

  // Start the game
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(gameDuration);
    setIsGameActive(true);
    setGameObjects([]);
    setHookPosition(250); // Reset hook position
    setHookDirection(1); // Reset hook direction
    setCatchAnimation(null);
    setLastCaughtItem(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [gameDuration]);

  // End the game
  const endGame = useCallback(() => {
    setIsGameActive(false);
  }, []);

  // Update the score
  const updateScore = useCallback((points) => {
    setScore((prevScore) => prevScore + points);
  }, []);

  // Spawn falling items
  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        const newItem = {
          id: Date.now(),
          type: ['fish', 'garbage', 'mystery'][Math.floor(Math.random() * 3)],
          points: 0,
          position: { x: 40 + Math.random() * 420, y: 0 }, // Random X position within bounds
        };
        
        // Set points based on type
        if (newItem.type === 'fish') {
          newItem.points = 20 + Math.floor(Math.random() * 40); // 20-60 points
        } else if (newItem.type === 'garbage') {
          newItem.points = -30 - Math.floor(Math.random() * 20); // -30 to -50 points
        } else if (newItem.type === 'mystery') {
          newItem.points = Math.floor(Math.random() * 101) - 50; // -50 to 50 points
        }
        
        setGameObjects((prev) => [...prev, newItem]);
      }, 2000); // Spawn items every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isGameActive]);

  // Move items downward
  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        setGameObjects((prev) => 
          prev
            .map((obj) => ({
              ...obj,
              position: { ...obj.position, y: obj.position.y + 5 }, // Move items down
            }))
            .filter(obj => obj.position.y < 480) // Remove items that fall out of view
        );
      }, 50); // Update position every 50ms

      return () => clearInterval(interval);
    }
  }, [isGameActive]);

  // Move the hook left and right
  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        setHookPosition((prev) => {
          const newPosition = prev + (hookDirection * 3); // Move hook by 3px per frame
          
          // Reverse direction at edges
          if (newPosition >= MAX_POSITION && hookDirection > 0) {
            setHookDirection(-1);
            return MAX_POSITION;
          } else if (newPosition <= MIN_POSITION && hookDirection < 0) {
            setHookDirection(1);
            return MIN_POSITION;
          }
          
          return newPosition;
        });
      }, 16); // ~60 FPS

      return () => clearInterval(interval);
    }
  }, [isGameActive, hookDirection]);

  // Check for collisions when the hook is dropped
  const dropHook = useCallback(() => {
    if (isGameActive && !catchAnimation) {
      // Start catch animation
      setCatchAnimation('dropping');
      
      // After a short delay, check for catch
      setTimeout(() => {
        const hookX = hookPosition;
        const hookY = 350; // Approximate vertical position where hook catches
        
        // Find objects near the hook
        const caughtObject = gameObjects.find((obj) => {
          const objX = obj.position.x;
          const objY = obj.position.y;
          return Math.abs(objX - hookX) < 40 && Math.abs(objY - hookY) < 100; // Wider catch area
        });
        
        if (caughtObject) {
          // Visual feedback for catch
          setLastCaughtItem({
            ...caughtObject,
            catchTime: Date.now()
          });
          
          // Update score
          updateScore(caughtObject.points);
          
          // Remove caught item
          setGameObjects((prev) => 
            prev.filter((obj) => obj.id !== caughtObject.id)
          );
          
          // Show "lifting" animation
          setCatchAnimation('lifting');
          
          // Reset animation state after lifting
          setTimeout(() => {
            setCatchAnimation(null);
          }, 500);
        } else {
          // No catch, just reset
          setCatchAnimation(null);
        }
      }, 500); // Check collision after 500ms (when hook is extended)
    }
  }, [isGameActive, gameObjects, hookPosition, updateScore, catchAnimation]);

  // Clear last caught item after showing feedback
  useEffect(() => {
    if (lastCaughtItem) {
      const timeout = setTimeout(() => {
        setLastCaughtItem(null);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [lastCaughtItem]);

  // Timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [isGameActive, timeLeft, endGame]);

  return {
    score,
    timeLeft,
    isGameActive,
    gameObjects,
    hookPosition,
    hookDirection,
    catchAnimation,
    lastCaughtItem,
    startGame,
    dropHook,
    updateScore,
    endGame
  };
};

export default useGameState;