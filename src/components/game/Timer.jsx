import React from 'react';

const Timer = ({ timeLeft }) => {
    return (
      <div className="timer">
        Time: {timeLeft}s
      </div>
    );
  };
  
  export default Timer; 