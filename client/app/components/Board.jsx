import React from 'react';
import Row from './Row';
import { useEffect } from 'react';
import io from 'socket.io-client';

const Board = ({ board_value }) => {
  //console.log('board_value:', board_value);
  const Rows = board_value.map((row, index) => <Row key={index} row_value={row} />);

  console.log('Rows:', Rows);

  return <div className="flex flex-col">{Rows}</div>;
};

export default Board;
