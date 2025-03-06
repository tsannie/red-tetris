import React, { use, useEffect } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitMove, emitRotate } from '../redux/socketSlice';
import { useLocation } from 'react-router';
import { login, logout, selectId, selectUsername } from '../redux/userSlice';

const Game = () => {
  const board = useSelector((state) => state.socket.board);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          dispatch(emitMove('left'));
          break;
        case 'ArrowRight':
          console.log('right');
          dispatch(emitMove('right'));
          break;
        case 'ArrowDown':
          dispatch(emitMove('down'));
          break;
        case 'ArrowUp':
          dispatch(emitRotate());
          break;
        case ' ':
          dispatch(emitDrop());
          break;
        default:
          break;
      }
    };

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
