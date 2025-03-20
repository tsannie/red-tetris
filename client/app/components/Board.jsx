import React from 'react';
import Cell from './Cell';

const Board = ({ board_value, size = 'normal' }) => {
  const sizeMap = {
    big: 'clamp(0.7rem, 4vh, 4.5rem)',
    normal: 'clamp(0.7rem, 3vh, 2.5rem)',
    small: 'clamp(0.5rem, 0.7vh, 3rem)',
  };

  const sizeBorderMap = {
    big: 'border-4',
    normal: 'border-0', // preview current/next game
    small: 'border-2',
  };

  const cellSize = sizeMap[size] || sizeMap.normal;

  return (
    <div
      className={`grid gap-0 border-black overflow-hidden ${sizeBorderMap[size]}`}
      style={{
        gridTemplateColumns: `repeat(${board_value[0].length}, ${cellSize})`,
        gridTemplateRows: `repeat(${board_value.length}, ${cellSize})`,
      }}
    >
      {board_value.flat().map((cell, index) => (
        <Cell key={index} cell_value={cell} />
      ))}
    </div>
  );
};

export default Board;
