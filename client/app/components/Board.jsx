import React from 'react';
import Column from './Column';
import { useEffect } from 'react';
import io from 'socket.io-client';

const Board = () => {
  const columns = Array.from({ length: 10 }, (_, index) => <Column key={index} />);

  return <div className="flex">{columns}</div>;
};

export default Board;
