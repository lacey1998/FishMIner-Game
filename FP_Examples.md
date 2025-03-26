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

### 1. Module Pattern in Our Firestore Service

Our `firestoreService.js` is a perfect example of the Module pattern. Take a look:

```javascript
// In firestoreService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  // other imports...
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'scores'; // Private constant

// Public functions
export const saveScore = async (scoreData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...scoreData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

export const getHighScores = async (limitCount = 10) => {
  // Implementation...
};
```

I implemented this module pattern to keep all our Firestore operations in one place. The beauty of this approach is that I can change how we store data without touching any game components. Also, notice how I kept the collection name as a private constant, but exposed only the functions that need to be public. 

This makes our code more maintainable because:
1. When we had to add high score functionality, I just added new functions in this module
2. If we need to switch to a different database in the future, we'd only need to change this file
3. The rest of the app only knows about these functions, not the implementation details

### 2. Custom Hook as a Composition Tool

My favorite pattern in this project is the custom hook implementation. It's really a form of the Composition pattern:

```javascript
// In useGameState.jsx
const useGameState = (gameDuration) => {
  // State definitions
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [gameObjects, setGameObjects] = useState([]);
  // More state...
  
  // Game logic functions
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(gameDuration);
    setIsGameActive(true);
    // More reset logic...
  }, [gameDuration]);
  
  const dropHook = useCallback(() => {
    // Hook dropping logic...
  }, [isGameActive, gameObjects, hookPosition, updateScore, catchAnimation]);
  
  // Timer effect
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
  
  // Return everything the component needs
  return {
    score, timeLeft, isGameActive, gameObjects,
    hookPosition, catchAnimation, lastCaughtItem,
    startGame, dropHook, updateScore, endGame
  };
};
```

When I was building this game, I realized the game state logic was getting complex, so I pulled it out into this custom hook. It's been a game-changer (pun intended!) for a few reasons:

- When I needed to add features (like the mystery items), I only had to modify the hook, not the components
- The Game component became much cleaner and focused on presentation
- Testing became easier because I could test the game logic separately from the UI

It's not exactly a Factory since it doesn't create different types of objects, but more like a Composition tool that composes different game behaviors together.

### 3. Container/Presentational Split

One pattern that really helped organize the code is the Container/Presentational split:

```javascript
// Container component (Game.jsx)
const Game = () => {
  // All the game state and logic from our hook
  const {
    score, timeLeft, isGameActive, gameObjects,
    hookPosition, catchAnimation, lastCaughtItem,
    startGame, dropHook
  } = useGameState(GAME_DURATION);
  
  // More container logic...
  
  return (
    <div className="game-container">
      <ScoreBoard score={score} targetScore={TARGET_SCORE} />
      <GameBoard
        gameObjects={gameObjects}
        hookPosition={hookPosition}
        catchAnimation={catchAnimation}
        lastCaughtItem={lastCaughtItem}
        dropHook={dropHook}
      />
      {/* UI rendering logic */}
    </div>
  );
};

// Presentational component (GameObject.jsx)
const GameObject = ({ type, position, points }) => {
  // Simple, focused on rendering only
  return (
    <div className={`game-object ${type}`} style={{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`
      // More styling...
    }}>
      {type === 'fish' ? '🐟' : type === 'garbage' ? '🗑️' : '📦'}
    </div>
  );
};
```

This separation has been super helpful during development. I had to rewrite parts of the game UI a couple of times, but because the logic was separate from the presentation, it didn't break anything. 

The GameObject component is dead simple - it just takes props and renders them. It doesn't know or care about game rules or state management. Meanwhile, the Game component handles all the wiring and logic. 

This made it easier to:
- Change the visuals without breaking game mechanics
- Debug issues (UI bugs vs. logic bugs were clearly separated)
- Add the high scores feature without having to touch any game mechanics

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