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
    sc: 'border-1 border-cyan-500',
    sb: 'border-1 border-blue-500',
    sy: 'border-1 border-yellow-500',
    so: 'border-1 border-orange-500',
    sg: 'border-1 border-green-500',
    sp: 'border-1 border-purple-500',
    sr: 'border-1 border-red-500',
  };

  return (
    <div
      className={`w-full h-full ${cell_value === 1 || cell_value[0] === 's' ? '' : 'border-1 border-black'} ${
        COLOR_CODE[cell_value]
      }`}
    />
  );
};

export default Cell;
