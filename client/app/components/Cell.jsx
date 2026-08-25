import React from 'react';

const PIECE_COLOR = {
  c: 'bg-piece-cyan',
  b: 'bg-piece-blue',
  y: 'bg-piece-yellow',
  o: 'bg-piece-orange',
  g: 'bg-piece-green',
  p: 'bg-piece-purple',
  r: 'bg-piece-red',
  t: 'bg-penalty',
};

const SHADOW_COLOR = {
  sc: 'border-2 border-piece-cyan',
  sb: 'border-2 border-piece-blue',
  sy: 'border-2 border-piece-yellow',
  so: 'border-2 border-piece-orange',
  sg: 'border-2 border-piece-green',
  sp: 'border-2 border-piece-purple',
  sr: 'border-2 border-piece-red',
};

const Cell = ({ cell_value }) => {
  if (cell_value === 's' || cell_value === 1) {
    return <div className="w-full h-full" />;
  }

  if (SHADOW_COLOR[cell_value]) {
    return <div className={`w-full h-full ${SHADOW_COLOR[cell_value]}`} />;
  }

  return <div className={`w-full h-full border border-gridline ${PIECE_COLOR[cell_value] || 'bg-field'}`} />;
};

export default Cell;
