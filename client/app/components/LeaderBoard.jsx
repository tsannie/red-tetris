import React from 'react';

const LeaderBoard = ({ players }) => {
  const getColor = (index) => {
    switch (index) {
      case 0:
        return 'text-yellow-500'; // Gold
      case 1:
        return 'text-gray-400'; // Silver
      case 2:
        return 'text-yellow-700'; // Bronze
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center flex-col h-full">
      <h2 className="text-3xl mb-4">Leaderboard</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index} className={getColor(index)}>
            {index + 1}. {player.username} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
