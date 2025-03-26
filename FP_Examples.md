# Functional Programming in Fish Miner Game

## 1. Functional Programming Principles

### Pure Functions

Pure functions always return the same output for the same input and have no side effects.


```javascript
// In GameObject.jsx
const getEmoji = () => {
  switch (type) {
    case 'fish':
      return '🐟';
    case 'garbage':
      return '🗑️';
    case 'mystery':
      return '📦';
    default:
      return '❓';
  }
};
```

This function is pure because:
- It always returns the same emoji for the same `type` input
- It doesn't modify any external state
- It has no side effects

**Hypothetical code that would break this principle:**

```javascript
let lastEmoji = ''; // Global state

const getEmoji = () => {
  const now = new Date();
  let emoji;
  
  // Using external state (time) affects output
  if (now.getHours() > 12) {
    emoji = type === 'fish' ? '🐠' : '🗑️';
  } else {
    emoji = type === 'fish' ? '🐟' : '🗑️';
  }
  
  // Side effect: modifying external state
  lastEmoji = emoji;
  
  return emoji;
};
```

### Immutability

Immutability means not changing existing data but creating new copies with modifications.


```javascript
// In useGameState.jsx
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
```

This code demonstrates immutability because:
- It creates a new array with `.map()` rather than modifying the existing array
- It creates new objects with spread operator `...obj` rather than modifying existing ones
- It creates new position objects with `{ ...obj.position, y: obj.position.y + 5 }` rather than modifying the existing position

**Hypothetical code that would break this principle:**

```javascript
useEffect(() => {
  if (isGameActive) {
    const interval = setInterval(() => {
      // Directly mutating state
      gameObjects.forEach(obj => {
        obj.position.y += 5; // Mutating the object
      });
      
      // Mutating the array
      for (let i = gameObjects.length - 1; i >= 0; i--) {
        if (gameObjects[i].position.y >= 480) {
          gameObjects.splice(i, 1); // Mutating the array
        }
      }
      
      // Forcing a re-render
      setGameObjects([...gameObjects]);
    }, 50);

    return () => clearInterval(interval);
  }
}, [isGameActive, gameObjects]);
```

### First-Class Functions

First-class functions means treating functions as values that can be passed around.


```javascript
// In Game.jsx
useEffect(() => {
  if (timeLeft === 0 && isGameActive) {
    handleEndGame();
  }
}, [timeLeft, isGameActive, handleEndGame]);
```

This demonstrates first-class functions because:
- `handleEndGame` is passed as a dependency to the `useEffect` hook
- The function is treated as a value that can be referenced and used elsewhere

**Hypothetical code that would break this principle:**

```javascript
// Instead of passing functions around, using string identifiers
useEffect(() => {
  if (timeLeft === 0 && isGameActive) {
    if (actionToPerform === "END_GAME") {
      // Hard-coded logic instead of passing a function
      endGame();
      setGameOver(true);
    }
  }
}, [timeLeft, isGameActive, actionToPerform]);
```

### Higher-Order Functions

Higher-order functions are functions that take other functions as arguments or return functions.


```javascript
// In GameBoard.jsx
{gameObjects.map(object => (
  <GameObject
    key={object.id}
    type={object.type}
    position={object.position}
    points={object.points}
  />
))}
```

This demonstrates higher-order functions because:
- `map` is a higher-order function that takes another function as an argument
- The arrow function passed to `map` transforms each game object into a React component

**Hypothetical code that would break this principle:**

```javascript
// Imperative approach without higher-order functions
const renderedObjects = [];
for (let i = 0; i < gameObjects.length; i++) {
  const object = gameObjects[i];
  renderedObjects.push(
    <GameObject
      key={object.id}
      type={object.type}
      position={object.position}
      points={object.points}
    />
  );
}

return (
  <div className="game-board">
    {renderedObjects}
    {/* ... rest of the code */}
  </div>
);
```

### Declarative Over Imperative

Declarative programming focuses on what to do, not how to do it.


```javascript
// In firestoreService.js
export const getHighScores = async (limitCount = 10) => {
  try {
    const scoresQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(scoresQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting scores:', error);
    throw error;
  }
};
```

This demonstrates declarative programming because:
- It describes what data to get (high scores ordered by score descending with a limit)
- It uses Firebase's declarative query API instead of manually sorting and limiting
- The transformation of the results is done with a declarative `map` operation

**Hypothetical code that would break this principle:**

```javascript
export const getHighScores = async (limitCount = 10) => {
  try {
    // Imperative approach
    const allScores = [];
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    // Manually process each document
    snapshot.forEach((doc) => {
      allScores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Manual sorting
    allScores.sort((a, b) => b.score - a.score);
    
    // Manual limit
    const limitedScores = allScores.slice(0, limitCount);
    
    return limitedScores;
  } catch (error) {
    console.error('Error getting scores:', error);
    throw error;
  }
};
```

## 2. Array Functional Programming Methods

### Example 1: Using `map` to transform data

```javascript
// In firestoreService.js
return snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

This uses the functional `map` method to transform each Firestore document into a clean JavaScript object with the document ID and all its data.

### Example 2: Using `filter` to remove elements

```javascript
// In useGameState.jsx
setGameObjects((prev) => 
  prev
    .map((obj) => ({
      ...obj,
      position: { ...obj.position, y: obj.position.y + 5 },
    }))
    .filter(obj => obj.position.y < 480) // Remove items that fall out of view
);
```

This uses the functional `filter` method to keep only the game objects that are still within the view (y < 480).

### Example 3: Chaining array methods for complex operations

```javascript
// In useGameState.jsx
// Find objects near the hook
const caughtObject = gameObjects.find((obj) => {
  const objX = obj.position.x;
  const objY = obj.position.y;
  return Math.abs(objX - hookX) < 40 && Math.abs(objY - hookY) < 100; // Wider catch area
});
```

This uses the functional `find` method to locate the first game object that meets the collision detection criteria.

## 3. Design Patterns

### 1. Module Pattern

```javascript
// In firestoreService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  // ... more imports
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'scores';

// Public API through exports
export const saveScore = async (scoreData) => {
  // Implementation details
};

export const getHighScores = async (limitCount = 10) => {
  // Implementation details
};

// ... more exported functions
```

The firestoreService.js implements the Module pattern by:
- Encapsulating related functionality in a single module
- Hiding implementation details and exposing only the public API through exports
- Maintaining private state (like COLLECTION_NAME) within the module scope

### 2. Custom Hook Pattern (variation of Factory pattern)

```javascript
// In useGameState.jsx
const useGameState = (gameDuration) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  // More state variables
  
  // Various methods and effects
  
  // Return an object with all the state and methods
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
```

The useGameState custom hook implements a variation of the Factory pattern by:
- Creating and returning an object with state and behavior
- Encapsulating related state and logic
- Allowing reuse of this functionality across components

### 3. Container/Presentational Pattern

```javascript
// Container component in Game.jsx
const Game = () => {
  // State and logic
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
  
  // More logic and handlers
  
  return (
    // JSX with presentational components
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
      {/* ... */}
    </div>
  );
};

// Presentational component in GameObject.jsx
const GameObject = ({ type, position, points }) => {
  const getEmoji = () => {
    // Implementation
  };
  
  return (
    <div
      className={`game-object ${type}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: '24px',
        transition: 'top 0.05s linear'
      }}
    >
      {getEmoji()}
    </div>
  );
};
```

This implements the Container/Presentational pattern by:
- Separating logic and state management (in Game.jsx) from presentation (in GameObject.jsx)
- Passing data down as props to presentational components
- Keeping presentational components pure and focused on rendering

## 4. Why These Are Good Applications of Functional Programming

### Pure Functions

The `getEmoji` function is an excellent application of the pure function principle because:
- It makes the code more predictable and easier to test
- It avoids unexpected side effects
- It improves readability and maintainability

### Immutability

The immutable state updates in `useGameState` are beneficial because:
- They prevent hard-to-track bugs from unexpected mutations
- They work well with React's rendering model, which relies on detecting changes
- They make it easier to implement features like time-travel debugging or undo/redo

### First-Class and Higher-Order Functions

The use of first-class and higher-order functions in your code:
- Enables composition of behavior
- Reduces code duplication
- Makes the code more expressive and easier to understand

### Declarative Programming

The declarative approach in your code:
- Makes the code more readable by focusing on the "what" rather than the "how"
- Reduces the amount of imperative state management code needed
- Leads to fewer bugs as there are fewer places where state can be accidentally modified

Breaking these principles in the hypothetical examples would lead to code that is more difficult to maintain, more prone to bugs, and less aligned with React's programming model, which strongly encourages functional programming principles. 