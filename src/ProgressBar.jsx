import React from 'react';
import { Colors } from './Colors';

const ProgressBar = ({ percentage }) => {

  const fillerStyles = {
    width: `${percentage}%`,
    backgroundColor: percentage > 100 ? Colors.accentColor1 : Colors.accentColor2,
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-filler" style={fillerStyles}>
        <span className="progress-bar-label">{`${percentage}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
