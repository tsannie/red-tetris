import React from 'react';

const WaitingRoom = () => {
  const players = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'];

  const handleStartGame = () => {
    console.log('Start Game');
  };

  return (
    <div className="w-full h-screen grid grid-rows-[15%_70%_15%]">
      {/* Room Title */}
      <div className="flex items-center justify-center text-7xl font-bold">Room</div>

      {/* Players List */}
      <div className="flex items-center justify-center">
        <ul className="grid grid-cols-1 grid-rows-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-center bg-red-950 rounded-lg w-64 h-16 text-2xl overflow-hidden"
            >
              {players[index] || '...'}
            </li>
          ))}
        </ul>
      </div>

      {/* Start Button */}
      <div className="flex items-center justify-center">
        <button
          className="px-6 py-3 bg-red-500 hover:bg-red-950 rounded-lg shadow-md text-2xl"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
