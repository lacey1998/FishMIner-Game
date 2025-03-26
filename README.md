# FishMiner-Game

## Project Overview
**Fish Miner** is a browser-based arcade game built with **React** that challenges players to catch falling items using a moving fish net. Inspired by classic games like *Gold Miner* but reimagined with a fishing twist, players must **strategically time their catches** to maximize their score while avoiding trash and the uncertainty of mystery boxes.

The fish net automatically moves left and right at the bottom of a virtual water tank, and players must **press the "Catch!" button to extend the net upward** and catch whatever item is in its path. With a 60-second timer ticking down and a target score of 500 points, every decision counts.

This project combines **React functional components, hooks, custom state logic**, and **CSS animations** to create a smooth and engaging gameplay experience. It also includes **persistent high scores using Firebase Firestore**, so players can keep track of their personal bests. Whether you're a casual gamer or looking to practice your timing skills, **Fish Miner** offers a fun and satisfying challenge.

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

## Youtube Videos
- Demo Video: https://youtu.be/hfin4tHRCkk
- Functional Programming Demonstration: https://youtu.be/GmwjP2N0ZGc

