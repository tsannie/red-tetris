import React from 'react';
import Column from './Column';
import { useEffect } from 'react';
import io from 'socket.io-client';

const Board = () => {
  const columns = Array.from({ length: 10 }, (_, index) => <Column key={index} />);

  /*   useEffect(() => {
    console.log('Connecting to the server...');
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Connection established with the server');
    });

    socket.on('updateGame', (data) => {
      console.log('Game updated:', data);
    });

    socket.on('newPiece', (data) => {
      console.log('New piece:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []); */

  return <div className="flex">{columns}</div>;
};

export default Board;
