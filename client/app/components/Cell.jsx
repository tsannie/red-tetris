import React from 'react';

const Cell = ({ cell_value }) => {
  return <div className={`w-10 h-10 border border-red-900 ${cell_value !== 0 ? 'bg-red-600' : ''}`} />;
};

export default Cell;
