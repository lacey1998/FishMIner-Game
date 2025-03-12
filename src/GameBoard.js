import React from 'react';
import GameObject from './GameObject';
import Hook from './Hook';

const GameBoard = ({ 
  gameObjects, 
  hookPosition, 
  dropHook, 
  catchAnimation,
  lastCaughtItem 
}) => {
  return (
    <div className="game-board">
      {/* Game objects (fish, garbage, etc) */}
      {gameObjects.map(object => (
        <GameObject
          key={object.id}
          type={object.type}
          position={object.position}
          points={object.points}
        />
      ))}
      
      {/* The hook/net */}
      <Hook 
        position={hookPosition} 
        catchAnimation={catchAnimation} 
      />
      
      {/* Catch button */}
      <button 
        className="catch-button" 
        onClick={dropHook}
        disabled={catchAnimation !== null}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: catchAnimation ? 0.5 : 1,
          cursor: catchAnimation ? 'not-allowed' : 'pointer'
        }}
      >
        Catch!
      </button>
      
      {/* Visual feedback for caught items */}
      {lastCaughtItem && (
        <div 
          className="catch-feedback"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            animation: 'fadeInOut 1.5s forwards',
            zIndex: 1000
          }}
        >
          {lastCaughtItem.type === 'fish' ? (
            <div>
              <span style={{ fontSize: '40px' }}>🐟</span>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                +{lastCaughtItem.points} points!
              </p>
            </div>
          ) : lastCaughtItem.type === 'garbage' ? (
            <div>
              <span style={{ fontSize: '40px' }}>🗑️</span>
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                {lastCaughtItem.points} points!
              </p>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '40px' }}>📦</span>
              <p style={{ 
                color: lastCaughtItem.points >= 0 ? 'green' : 'red', 
                fontWeight: 'bold' 
              }}>
                {lastCaughtItem.points >= 0 ? '+' : ''}{lastCaughtItem.points} points!
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Water surface animation */}
      <div 
        className="water-surface"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '30px',
          height: '10px',
          background: 'linear-gradient(transparent, rgba(0, 120, 255, 0.3), transparent)',
          animation: 'wave 2s infinite ease-in-out'
        }}
      />
    </div>
  );
};

export default GameBoard;