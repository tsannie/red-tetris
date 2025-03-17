import React from 'react';

const Cell = ({ cell_value }) => {
  const COLOR_CODE = {
    c: 'bg-cyan-500',
    b: 'bg-blue-500',
    y: 'bg-yellow-500',
    o: 'bg-orange-500',
    g: 'bg-green-500',
    p: 'bg-purple-500',
    r: 'bg-red-500',
    t: 'bg-black',
  };

  return <div className={`w-10 h-10 border border-red-900 ${COLOR_CODE[cell_value]}`} />;
};

export default Cell;
