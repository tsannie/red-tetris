import React, { useEffect } from 'react';
import Board from './Board';
import { useSelector } from 'react-redux';

const OpponentsBoard = ({ otherPlayers }) => {
  const deadPlayer = useSelector((state) => state.socket.deadPlayer);

  useEffect(() => {
    console.log('deadPlayer', deadPlayer);
  }, [deadPlayer]);

  if (!otherPlayers || otherPlayers.length === 0) {
    return (
      <div className="flex flex-col items-center border-4 border-white p-4 invisible">
        <h2 className="text-4xl mb-4">Opponents</h2>
        <div className="grid grid-rows-2 grid-cols-2 gap-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center border-4 border-white p-4">
      <h2 className="text-4xl mb-4">Opponents</h2>
      <div className="grid grid-rows-2 grid-cols-2 gap-4">
        {otherPlayers.map((player, index) => (
          <div key={index} className="flex items-center justify-center flex-col">
            <Board board_value={player.grid} size="small" isDarkened={deadPlayer.includes(player.id)} />
            <h3 className="text-xl mt-2">{player.pseudo}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpponentsBoard;
