import React from 'react';

const Hook = ({ position, catchAnimation }) => {
  // Calculate vertical position based on animation state
  const getBottomPosition = () => {
    if (catchAnimation === 'dropping') {
      return '150px'; // Extended position for catching
    } else if (catchAnimation === 'lifting') {
      return '70px'; // Regular position, but with animation
    } else {
      return '70px'; // Regular position
    }
  };

  return (
    <div
      className="hook"
      style={{
        position: 'absolute',
        left: `${position}px`, // Horizontal position
        bottom: getBottomPosition(), // Vertical position based on animation
        fontSize: '40px',
        transition: catchAnimation 
          ? 'bottom 0.5s ease-in-out, left 0.1s linear' // Slower vertical for catching
          : 'left 0.1s linear', // Just horizontal when moving
        zIndex: 100
      }}
    >
      🪣
      
      {/* Show a line when catching */}
      {catchAnimation && (
        <div 
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            width: '2px',
            height: catchAnimation === 'dropping' ? '100px' : '0px',
            backgroundColor: '#333',
            transform: 'translateX(-50%)',
            transition: 'height 0.5s ease-in-out'
          }}
        />
      )}
    </div>
  );
};

export default Hook;