import React from 'react';

const GameObject = ({ type, position, points }) => {
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
  
    return (
      <div
        className={`game-object ${type}`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: '24px',
          transition: 'top 0.05s linear' // Smooth falling animation
        }}
      >
        {getEmoji()}
      </div>
    );
  };
  
  export default GameObject;