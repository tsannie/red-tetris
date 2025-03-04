import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useSelector } from 'react-redux';

const Game = () => {
  const [board, setBoard] = React.useState();
  const socket = useSelector((state) => state.socket);

  useEffect(() => {
    console.log('Socket:', socket);
  }, [socket]);

  /*   useEffect(() => {
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
  }, []); */

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
