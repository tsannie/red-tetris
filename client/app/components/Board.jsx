import React from 'react';
import Cell from './Cell';

const Board = ({ board_value, size = 'normal' }) => {
  const sizeMap = {
    big: 'min(5vw, 1.7rem)',
    normal: 'min(3vw, 1rem)',
    small: 'min(2vw, 0.7rem)',
  };

  const sizeBorderMap = {
    big: 'border-4',
    normal: 'border',
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
