import React from 'react';
import { useSelector } from 'react-redux';
import { selectPseudo } from '../redux/pseudoSlice';

const Room = () => {
  const pseudo = useSelector((state) => selectPseudo(state));
  return (
    <div>
      <h1>Room</h1>
      <p>Welcome, {pseudo}!</p>
    </div>
  );
};

export default Room;
