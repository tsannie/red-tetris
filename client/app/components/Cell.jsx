import React from 'react';

const Cell = ({ cell_value }) => {
  //console.log('type:', type);
  return <div className={`w-10 h-10 border border-gray-300 ${cell_value !== 0 ? 'bg-red-500' : ''}`} />;
};

export default Cell;
