import React from 'react';
import Board from './Board';

const TetriminoDisplayBox = ({ tetrimino, title }) => {
  return (
    <div className="flex items-center flex-col h-full">
      <h2 className="text-4xl mb-4">{title}</h2>
      <div className="h-20 flex items-center justify-center">
        <Board board_value={tetrimino} size="normal" />
      </div>
    </div>
  );
};

export default TetriminoDisplayBox;
