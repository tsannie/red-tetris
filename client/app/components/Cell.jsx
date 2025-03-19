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

  return <div className={`w-full h-full border-1 border-black ${COLOR_CODE[cell_value]}`} />;
};

export default Cell;
