import React from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from '../redux/roomInfoSlice';

const Room = () => {
  const username = useSelector((state) => selectUsername(state));

  return (
    <div>
      <h1>Room</h1>
      <p>Hello {username}</p>
    </div>
  );
};

export default Room;
