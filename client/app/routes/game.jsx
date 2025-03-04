import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useSelector } from 'react-redux';
import { emitMove } from '../redux/socketSlice';

const Game = () => {
  const socket = useSelector((state) => state.socket);
  const board = useSelector((state) => state.socket.board);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          emitMove('left');
          break;
        case 'ArrowRight':
          console.log('right');
          emitMove('right');
          break;
        case 'ArrowDown':
          socket.emit('move', 'down');
          break;
        case 'ArrowUp':
          socket.emit('rotate');
          break;
        case ' ':
          socket.emit('drop');
          break;
        default:
          break;
      }
    };

    console.log('Adding event listener');
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!board || !board.length) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <Board board_value={board} />
      </div>
    );
  }
};

export default Game;
