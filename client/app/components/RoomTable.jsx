import React, { useEffect } from 'react';

const RoomTable = ({ roomsList, onSelect }) => {
  return (
    <table className="border-collapse rounded-lg overflow-hidden outline outline-4 outline-edge">
      <thead>
        <tr className="bg-accent text-white">
          <th className="border border-edge p-2 first:rounded-tl-lg last:rounded-tr-lg">Room Name</th>
          <th className="border border-edge p-2">Admin</th>
          <th className="border border-edge p-2">Players</th>
          <th className="border border-edge p-2">State</th>
          <th className="border border-edge p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {roomsList.map((room) => (
          <tr key={room.room_name} className="bg-surface hover:bg-off transition-colors">
            <td className="border p-2">
              {room.room_name.length > 15 ? room.room_name.slice(0, 12) + '...' : room.room_name}
            </td>
            <td className="border p-2">
              {room.admin_username.length > 15 ? room.admin_username.slice(0, 12) + '...' : room.admin_username}
            </td>
            <td className="border p-2">{room.nb_players}</td>
            <td className="border p-2">{room.state.length > 15 ? room.state.slice(0, 12) + '...' : room.state}</td>
            <td className="border p-2">
              <button
                className="px-4 py-1 rounded bg-accent text-white hover:bg-accent-hi disabled:bg-off disabled:text-muted transition-colors"
                onClick={() => onSelect(room.room_name)}
                disabled={room.state !== 'waiting'}
              >
                Join
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
