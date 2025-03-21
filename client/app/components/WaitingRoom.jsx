import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminId, selectPlayers, selectRoomName, selectUserId } from '../redux/roomInfoSlice';
import { emitRoomWaiting, emitStart } from '../redux/socketSlice';
import ExitButton from './ExitButton';

const WaitingRoom = () => {
  const players = useSelector((state) => selectPlayers(state));
  const user_id = useSelector((state) => selectUserId(state));
  const admin_id = useSelector((state) => selectAdminId(state));
  const roomName = useSelector((state) => selectRoomName(state));
  const lastWinnerId = useSelector((state) => state.socket.lastWinnerId);

  const dispatch = useDispatch();

  const handleStartGame = () => {
    dispatch(emitStart());
  };

  useEffect(() => {
    if (lastWinnerId && user_id === admin_id) {
      dispatch(emitRoomWaiting());
    }
  }, [lastWinnerId]);

  return (
    <>
      <ExitButton />
      <div className="w-full h-screen grid grid-rows-[15%_70%_15%]">
        {/* Rooms Title */}
        <div className="flex items-center justify-center text-7xl font-bold">{roomName}</div>

        {/* Players List */}
        <div className="flex items-center justify-center">
          <ul className="grid grid-cols-1 grid-rows-6 gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className={`flex items-center justify-center rounded-lg w-64 h-16 text-2xl overflow-hidden bg-red-950 ${
                  players[index]?.id === lastWinnerId ? 'text-yellow-500' : ''
                }`}
              >
                {players[index] ? players[index].username : '...'}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-center">
          {user_id === admin_id && (
            <button
              className="px-6 py-3 bg-red-500 hover:bg-red-950 rounded-lg shadow-md text-2xl mr-4"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
