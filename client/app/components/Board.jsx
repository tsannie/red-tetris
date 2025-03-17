import React from 'react';
import Cell from './Cell';

const Board = ({ board_value }) => {
  return (
    <div
      className="grid gap-0 border-4 border-white"
      style={{
        gridTemplateColumns: `repeat(${board_value[0].length}, 2.5rem)`,
        gridTemplateRows: `repeat(${board_value.length}, 2.5rem)`,
      }}
    >
      {board_value.flat().map((cell, index) => (
        <Cell key={index} cell_value={cell} />
      ))}
    </div>
  );
};

export default Board;
