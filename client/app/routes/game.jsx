import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitJoinOrCreateRoom, emitMove, emitRotate } from '../redux/socketSlice';
import WaitingRoom from '../components/WaitingRoom';
import TetriminoDisplayBox from '../components/TetriminoDisplayBox';

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
    [0, 'p', 0],
    ['p', 'p', 'p'],
  ];

  const another_exemple_date_tetri = [
    ['y', 'y'],
    ['y', 'y'],
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
      // grid 2 rows 60% 40%
      <div
        className="grid grid-cols-[60%_40%]
      gap-0 h-screen max-w-screen-lg overflow-hidden items-center p-4"
      >
        <div className="flex flex-col items-center justify-center">
          <Board board_value={board} size="big" />
        </div>
        <div className="flex flex-col justify-around items-center h-5/6">
          <div className="flex items-center justify-around w-full border-4 border-white p-4">
            <TetriminoDisplayBox tetrimino={exemple_date_tetri} title="Current" />
            <TetriminoDisplayBox tetrimino={another_exemple_date_tetri} title="Next" />
          </div>
          <div className="flex flex-col items-center justify-center w-full border-4 border-white p-4">
            <h2 className="text-4xl mb-4">Opponents</h2>
            <div className="grid grid-rows-2 grid-cols-2 gap-4">
              <div className="flex items-center justify-center flex-col">
                <Board board_value={board} size="small" />
                <h3 className="text-xl mt-2">player1</h3>
              </div>
              <div className="flex items-center justify-center flex-col">
                <Board board_value={board} size="small" />
                <h3 className="text-xl mt-2">player2</h3>
              </div>
              <div className="flex items-center justify-center flex-col">
                <Board board_value={board} size="small" />
                <h3 className="text-xl mt-2">player3</h3>
              </div>
              <div className="flex items-center justify-center flex-col">
                <Board board_value={board} size="small" />
                <h3 className="text-xl mt-2">player4</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Game;
