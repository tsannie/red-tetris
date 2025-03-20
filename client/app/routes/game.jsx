import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitMove, emitRotate } from '../redux/socketSlice';
import WaitingRoom from '../components/WaitingRoom';
import TetriminoDisplayBox from '../components/TetriminoDisplayBox';
import ExitButton from '../components/ExitButton';
import OpponentsBoard from '../components/OpponentsBoard';

const Game = () => {
  const board = useSelector((state) => state.socket.board);
  const next = useSelector((state) => state.socket.next);
  const current = useSelector((state) => state.socket.current);
  const otherPlayers = useSelector((state) => state.socket.otherPlayers);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('board', board);
    console.log('next', next);
    console.log('current', current);
    console.log('otherPlayers', otherPlayers);
  }, [board, next, current, otherPlayers]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          dispatch(emitMove('LEFT'));
          break;
        case 'ArrowRight':
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
  }

  return (
    <React.Fragment>
      <ExitButton />
      <div className="w-full h-full flex justify-center">
        <div className="w-full h-full flex justify-center max-w-[3000px]">
          <div className="flex flex-rows w-screen h-screen p-4 items-center justify-evenly">
            <div className="flex items-center justify-center">
              <Board board_value={board} size="big" />
            </div>
            <div className="flex flex-col justify-around items-center overflow-hidden w-md h-full max-h-[1500px]">
              <div className="grid grid-cols-2 items-center justify-around border-4 border-white w-full p-4 min-h-[25vh]">
                <TetriminoDisplayBox tetrimino={current} title="Current" />
                <TetriminoDisplayBox tetrimino={next} title="Next" />
              </div>
              <OpponentsBoard otherPlayers={otherPlayers} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Game;
