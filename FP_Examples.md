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

### Factory Method Pattern

The way we create game objects follows the Factory Method pattern:

```javascript
// In useGameState.jsx - createGameObject function
const createGameObject = (type) => {
  const x = Math.floor(Math.random() * (GAME_WIDTH - 50));
  const points = type === 'fish' 
    ? Math.floor(Math.random() * 30) + 20
    : type === 'garbage' 
      ? -30 
      : Math.floor(Math.random() * 100) - 50; // Mystery box

  return {
    id: Date.now() + Math.random().toString(),
    type,
    position: { x, y: 0 },
    points
  };
};
```

This Factory Method pattern allows us to:
1. Create different types of game objects (fish, garbage, mystery boxes)
2. Encapsulate the object creation logic in one place
3. Easily extend the game with new object types without changing the game logic

### Observer Pattern

Our game uses the Observer pattern through React's state and effect hooks:

```javascript
// In useGameState.jsx
// Timer effect observes game state changes
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

// Objects movement effect observes game state
useEffect(() => {
  if (isGameActive) {
    const interval = setInterval(() => {
      setGameObjects((prev) => 
        prev
          .map((obj) => ({
            ...obj,
            position: { ...obj.position, y: obj.position.y + 5 },
          }))
          .filter(obj => obj.position.y < 480)
      );
    }, 50);

    return () => clearInterval(interval);
  }
}, [isGameActive]);
```

This Observer pattern implementation:
1. Allows components to react to state changes without tight coupling
2. Keeps the UI in sync with the game state automatically
3. Separates the notification logic from the business logic

### State Pattern

The game's different states (active, paused, game over) are managed using the State pattern:

```javascript
// In useGameState.jsx
const [isGameActive, setIsGameActive] = useState(false);
const [isGameOver, setIsGameOver] = useState(false);

// Functions that change the game state
const startGame = useCallback(() => {
  setScore(0);
  setTimeLeft(gameDuration);
  setIsGameActive(true);
  setIsGameOver(false);
  setGameObjects([]);
  setLastCaughtItem(null);
  setCatchAnimation(false);
}, [gameDuration]);

const endGame = useCallback(() => {
  setIsGameActive(false);
  setIsGameOver(true);
}, []);

// Component behavior changes based on state
return (
  <div className="game-container">
    {!isGameActive && !isGameOver && (
      <button className="start-button" onClick={startGame}>
        Start Game
      </button>
    )}
    
    {isGameActive && (
      <GameBoard
        gameObjects={gameObjects}
        hookPosition={hookPosition}
        catchAnimation={catchAnimation}
        dropHook={dropHook}
      />
    )}
    
    {isGameOver && (
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        <button onClick={startGame}>Play Again</button>
      </div>
    )}
  </div>
);
```

The State pattern provides:
1. Clear separation between different game states
2. Consistent behavior within each state
3. Controlled transitions between states

### Singleton Pattern

Our Firebase configuration uses the Singleton pattern to ensure only one connection to Firebase exists:

```javascript
// In config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // other config properties
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

This Singleton implementation:
1. Provides a global point of access to the Firebase instance
2. Ensures we only create one connection to Firebase
3. Controls instantiation of the Firebase app

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