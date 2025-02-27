import React from 'react';
import Cell from './Cell';

const Column = () => {
  const N_CELLS = 20;
  const cells = Array.from({ length: N_CELLS }, (_, index) => <Cell key={index} />);

  return <div className="column flex flex-col">{cells}</div>;
};

export default Column;
