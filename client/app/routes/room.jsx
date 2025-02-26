import React from 'react';
import { useSelector } from 'react-redux';

const Room = () => {
  const pseudo = useSelector((state) => state.pseudo.value);
  return (
    <div>
      <h1>Room</h1>
      <p>Welcome, {pseudo}!</p>
    </div>
  );
};

export default Room;
