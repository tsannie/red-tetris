import React, { useEffect } from 'react';
import Board from '../components/Board';
import io from 'socket.io-client';

const Game = () => {
  useEffect(() => {
    console.log('Connecting to the server...');
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Connection established with the server');
    });

    socket.on('update', (data) => {
      console.log('Game updated:', data);
    });

    socket.on('newPiece', (data) => {
      console.log('New piece:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Board />
    </div>
  );
};

export default Game;
