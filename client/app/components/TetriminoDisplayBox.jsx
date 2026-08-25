import React from 'react';
import Board from './Board';

const TetriminoDisplayBox = ({ tetrimino, title }) => {
  return (
    <div className="items-center  h-full grid grid-rows-[40%_80%] justify-center">
      <h2 className="text-4xl mb-4 text-muted">{title}</h2>
      <div className="items-center justify-center flex ">
        <Board board_value={tetrimino} size="normal" />
      </div>
    </div>
  );
};

export default TetriminoDisplayBox;
