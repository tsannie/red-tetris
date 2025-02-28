import React, { useEffect } from 'react';
import Board from '../components/Board';
import io from 'socket.io-client';

const Game = () => {
  const [board, setBoard] = React.useState();

  useEffect(() => {
    console.log('Connecting to the server...');
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Connection established with the server');
    });

    socket.on('update', (data) => {
      setBoard(data.board);
      console.log('Game updated:', data);
    });

    socket.on('newPiece', (data) => {
      console.log('New piece:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!board) {
    return null;
  }

  return (
    <div>
      <Board board_value={board} />
    </div>
  );
};

export default Game;
