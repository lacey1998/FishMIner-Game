# FishMiner-Game

## Project Overview
**Fish Miner** is a browser-based arcade game built with **React** that challenges players to catch falling items using a moving fish net. Inspired by classic games like *Gold Miner* but reimagined with a fishing twist, players must **strategically time their catches** to maximize their score while avoiding trash and the uncertainty of mystery boxes.

The fish net automatically moves left and right at the bottom of a virtual water tank, and players must **press the "Catch!" button to extend the net upward** and catch whatever item is in its path. With a 60-second timer ticking down and a target score of 500 points, every decision counts.

This project combines **React functional components, hooks, custom state logic**, and **CSS animations** to create a smooth and engaging gameplay experience. It also includes **persistent high scores using Firebase Firestore**, so players can keep track of their personal bests. Whether you're a casual gamer or looking to practice your timing skills, **Fish Miner** offers a fun and satisfying challenge.

## 🎮 User Dimensions

Our user personas were selected based on two key dimensions that significantly impact how players interact with Fish Miner:

### 1. Gaming Commitment Level (Casual ↔ Competitive)
```
Casual ------|---------|---------|-------- Competitive
           Sarah     Tommy      Lisa        Alex
```
- **Casual**: Quick sessions, focus on entertainment
- **Moderate**: Regular play with some goal-setting
- **Competitive**: Achievement-focused, leaderboard-driven

### 2. Game Functionality Access (Basic ↔ Advanced)
```
Basic --------|---------|---------|-------- Advanced
            Tommy      Sarah      Alex       Lisa
```
- **Basic**: Core gameplay only (catching fish, scoring)
- **Intermediate**: Additional features (high scores, profiles)
- **Advanced**: Administrative functions, data management

These dimensions were chosen because they:
1. Directly impact feature requirements and UI complexity
2. Help balance accessibility with competitive depth
3. Guide development priorities for different user segments
4. Inform the design of both gameplay and administrative features

## 📂 Project Structure
```
fishminer-game/
├── dist/ # Build output directory
├── public/ # Public assets
│ └── index.html # HTML entry point
├── src/
│ ├── components/ # React components
│ │ ├── Game.jsx # Main game component
│ │ ├── GameBoard.jsx # Game board component
│ │ ├── HighScores.jsx # High scores component
│ │ ├── Hook.jsx # Hook/fishing net component
│ │ ├── ScoreBoard.jsx # Score display component
│ │ └── Timer.jsx # Game timer component
│ ├── config/
│ │ └── firebase.js # Firebase configuration
│ ├── services/
│ │ └── firestoreService.js # Firestore operations
│ ├── styles/
│ │ └── App.css # Global styles
│ ├── App.jsx # Root React component
│ └── main.jsx # Application entry point
├── .firebaserc # Firebase project configuration
├── .gitignore # Git ignore rules
├── firebase.json # Firebase hosting configuration
├── index.html # Root HTML template
├── package.json # Project dependencies and scripts
├── README.md # Project documentation
└── vite.config.js # Vite configuration
```

## 📖 How to Use
### **1️⃣ Installation**
```sh
# Clone the repository
git clone https://github.com/lacey1998/FishMiner-Game.git
cd FishMiner-Game

# Install dependencies
npm install

# Build for production
npm run build

# Run locally and Preview production build
npm run preview

# Deploy to Firebase
npm install -g firebase-tools
firebase login
firebase init
npm run build 
firebase deploy

# The game will go live at: https://fishminer-game.web.app
```

## Features

- **Moving Fish Net** that automatically moves left and right
- **Catch Falling Items** (fish, garbage, mystery boxes)
- **Countdown Timer** (60 seconds)
- **Scoring System**
- **Mystery Boxes** with random score values
- **CSS animations** for falling objects and catching
- **Play Again** functionality
- **High Score Saving** using **Firebase Firestore**

## CRUD Operations

This project implements full CRUD (Create, Read, Update, Delete) operations on the `scores` collection in Firebase Firestore:

### Create
- Players can save their scores after completing a game
- Each score includes the player's name, points achieved, and a timestamp
- Implementation: `saveScore()` function in `firestoreService.js`

### Read
- High scores are displayed in a leaderboard
- Scores can be retrieved individually or as a filtered, sorted collection
- Implementation: `getHighScores()` and `getScoreById()` functions

### Update
- Score records can be edited through the admin interface
- Updates maintain document IDs while modifying content
- Implementation: `updateScore()` function with the ScoreManager component

### Delete
- Unwanted scores can be removed from the database
- Deletion includes confirmation to prevent accidental removal
- Implementation: `deleteScore()` function with UI integration

The CRUD functionality is fully integrated with the game's UI, allowing seamless data management while maintaining database integrity through proper error handling.

## Demonstrate of functional programming
- Please refer to file FP_Examples.md

## Youtube Videos
- Demo Video: https://youtu.be/hfin4tHRCkk
- Functional Programming Demonstration: https://youtu.be/GmwjP2N0ZGc

## 🛠️ Technical Stack
- **React** – JavaScript UI library with functional components and hooks
- **Vite** – Frontend build tool for fast development and optimized production builds
- **Firebase** – Cloud services for hosting and Firestore database
- **JavaScript (ES6+)** – Modern JavaScript features
- **CSS3** – Styling and animations
- **Functional Programming** – Pure functions, immutability, higher-order functions
- **Component-Based Architecture** – Modular UI components
- **Responsive Design** – Mobile-friendly interface
- **State Management** – React hooks (useState, useEffect, useContext)

## 📜 License
This project is licensed under the **MIT License**.

## 📌 Use of Generative AI in Development

### **Purpose**
Generative AI (ChatGPT) was consulted during development to enhance understanding of functional programming principles, React best practices, and game mechanics implementation.

### **Prompts and Responses**

#### **Prompt:**
_"How to store scores using Firestore in my React game?"_

✅ **Response:**
ChatGPT provided guidance on implementing Firestore for high score tracking:
- Setting up Firebase project and Firestore database configuration
- Creating a scores collection with appropriate document structure
- Implementing write operations to save new scores with timestamps and usernames
- Using queries to retrieve top scores sorted by value
- Adding security rules to prevent score manipulation
- Best practices for optimizing reads/writes to minimize costs

#### **Prompt:**
_"How to create a countdown timer in my game?"_

✅ **Response:**
ChatGPT suggested implementing a timer using React state and effects:
- Using useState to track remaining time and LOCAL_STORAGE_KEY for persistence
- Setting up useEffect with setInterval for consistent countdown
- Adding cleanup functions to prevent memory leaks
- Creating conditional rendering based on timer state
- Implementing pause/resume functionality
- Best practices for managing timer accuracy across component re-renders

#### **Prompt:**
_"How to show a notification when user actually caught something?"_

✅ **Response:**
ChatGPT recommended notification approaches:
- Creating a temporary overlay component that appears upon successful catches
- Implementing CSS animations for visual feedback
- Using audio cues with the Web Audio API for sound effects
- Setting up a notification queue for multiple rapid catches
- Adding accessibility features for notifications
- Best practices for non-intrusive UI feedback that maintains gameplay flow

#### **Prompt:**
_"How to create a custom game state management hook for my React fishing game?"_

✅ **Response:**
ChatGPT provided guidance on creating a custom state management solution:
- Building a custom `useGameState` hook to centralize all game logic
- Implementing useState for various game properties (score, objects, timer, hook position)
- Using useCallback to memoize frequently-used functions like startGame and dropHook
- Managing related state changes in a single function to prevent race conditions
- Creating a state reset mechanism for starting new games
- Organizing state logic with proper separation of concerns
- Handling side effects with useEffect for timer, object generation and movement
- Returning only necessary state and functions to keep component interfaces clean
- Structuring the hook for reusability in case of future game variations

## 👥 User Personas

// ... existing code ...

