import React, { use, useEffect, useState } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitJoinOrCreateRoom, emitMove, emitRotate } from '../redux/socketSlice';
import { useLocation } from 'react-router';
import WaitingRoom from '../components/WaitingRoom';
import TetriminoDisplayBox from '../components/TetriminoDisplayBox';
import LeaderBoard from '../components/LeaderBoard';

export function meta() {
  return [{ title: 'Game' }, { name: 'description', content: 'Game page' }];
}

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

  const exemple_date_tetri = [
    [0, 0, 0, 0],
    ['c', 'c', 'c', 'c'],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const another_exemple_date_tetri = [
    [0, 0, 0, 0],
    [0, 'o', 'o', 0],
    [0, 'o', 'o', 0],
    [0, 0, 0, 0],
  ];

  const exemple_data_leaderboard = [
    { username: 'player1', score: 100 },
    { username: 'player2', score: 200 },
    { username: 'player3', score: 300 },
    { username: 'player4', score: 400 },
    { username: 'player5', score: 500 },
    { username: 'player6', score: 600 },
  ];

  if (!board || !board.length) {
    return <WaitingRoom />;
  } else {
    return (
      <div className="grid grid-cols-5 grid-rows-7 gap-0 h-screen max-w-screen-lg m-auto">
        <div className="col-start-1 col-end-4 row-start-1 row-end-8 flex items-center justify-center">
          <Board board_value={board} />
        </div>
        <div className="col-start-4 col-end-6 row-start-1 row-end-3">
          <TetriminoDisplayBox tetrimino={exemple_date_tetri} title="Current" />
        </div>
        <div className="col-start-4 col-end-6 row-start-3 row-end-5 ">
          <TetriminoDisplayBox tetrimino={another_exemple_date_tetri} title="Next" />
        </div>
        <div className="col-start-4 col-end-6 row-start-5 row-end-8 ">
          <LeaderBoard players={exemple_data_leaderboard} />
        </div>
      </div>
    );
  }
};

export default Game;
