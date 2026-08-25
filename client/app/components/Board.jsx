import React from 'react';
import Cell from './Cell';

const Board = ({ board_value, size = 'normal', isDarkened = false }) => {
  const sizeMap = {
    big: 'clamp(0.7rem, 4vh, 4.5rem)',
    normal: 'clamp(0.7rem, 3vh, 2.5rem)',
    small: 'clamp(0.5rem, 0.7vh, 3rem)',
  };

  const sizeBorderMap = {
    big: 'border-4 border-edge',
    normal: 'border-0', // preview current/next
    small: 'border-2 border-edge',
  };

  const cellSize = sizeMap[size] || sizeMap.normal;

  return (
    <div
      className={`relative grid gap-0 overflow-hidden ${sizeBorderMap[size]}`}
      style={{
        gridTemplateColumns: `repeat(${board_value[0].length}, ${cellSize})`,
        gridTemplateRows: `repeat(${board_value.length}, ${cellSize})`,
      }}
    >
      {board_value.flat().map((cell, index) => (
        <Cell key={index} cell_value={cell} />
      ))}
      {isDarkened && <div className="absolute inset-0 bg-black/70" />}
    </div>
  );
};

export default Board;
