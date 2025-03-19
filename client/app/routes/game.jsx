import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useDispatch, useSelector } from 'react-redux';
import { emitDrop, emitJoinOrCreateRoom, emitMove, emitRotate } from '../redux/socketSlice';
import WaitingRoom from '../components/WaitingRoom';
import TetriminoDisplayBox from '../components/TetriminoDisplayBox';
import ExitButton from '../components/ExitButton';

export function meta() {
  return [{ title: 'Game' }, { name: 'description', content: 'Game page' }];
}

const Game = () => {
  const board = useSelector((state) => state.socket.board);
  const next = useSelector((state) => state.socket.next);
  const current = useSelector((state) => state.socket.current);
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
    ['p', 'p', 'p', 'p'],
    ['p', 'p', 'p', 'p'],
    ['p', 'p', 'p', 'p'],
  ];

  const another_exemple_date_tetri = [
    ['y', 'y', 'y', 'y'],
    ['y', 'y', 'y', 'y'],
    ['y', 'y', 'y', 'y'],
  ];

  if (!board || !board.length) {
    return <WaitingRoom />;
  } else {
    return (
      // grid 2 rows 60% 40%
      <React.Fragment>
        <ExitButton />

        <div className="w-full h-full flex justify-center">
          <div className="w-full h-full flex justify-center max-w-[3000px]">
            <div className="flex flex-rows w-screen h-screen p-4 items-center justify-evenly">
              <div className="flex items-center justify-center">
                <Board board_value={board} size="big" />
              </div>
              <div className="flex flex-col justify-around items-center overflow-hidden w-md h-full max-h-[1500px]">
                <div className="flex items-center justify-around border-4 border-white w-full p-4">
                  <TetriminoDisplayBox tetrimino={current} title="Current" />
                  {/* <TetriminoDisplayBox tetrimino={next} title="Next" /> */}
                </div>
                <div className="flex flex-col items-center border-4 border-white p-4 ">
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
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default Game;
