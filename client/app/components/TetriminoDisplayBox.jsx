import React from 'react';
import Board from './Board';

const TetriminoDisplayBox = ({ tetrimino, title }) => {
  return (
    <div className="flex items-center justify-center flex-col h-full">
      <h2 className="text-3xl mb-4">{title}</h2>
      <Board board_value={tetrimino} />
    </div>
  );
};

export default TetriminoDisplayBox;
