import React, { use, useEffect, useState } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitJoinOrCreateRoom, emitMove, emitRotate } from '../redux/socketSlice';
import { useLocation } from 'react-router';
import WaitingRoom from '../components/WaitingRoom';

const Game = () => {
  const board = useSelector((state) => state.socket.board);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          dispatch(emitMove('LEFT'));
          break;
        case 'ArrowRight':
          console.log('right');
          dispatch(emitMove('RIGHT'));
          break;
        case 'ArrowDown':
          dispatch(emitMove('DOWN'));
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
    return <WaitingRoom />;
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <Board board_value={board} />
      </div>
    );
  }
};

export default Game;
