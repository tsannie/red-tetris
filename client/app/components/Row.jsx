import React from 'react';
import Cell from './Cell';

const Row = ({ row_value }) => {
  //console.log('row_value:', row_value);
  const cells = row_value.map((cell, index) => <Cell key={index} cell_value={cell} />);

  return <div className="Row flex">{cells}</div>;
};

export default Row;
