import React, { useEffect } from 'react';

const RoomTable = ({ roomsList, onSelect }) => {
  return (
    <table className=" border-collapse border rounded-lg overflow-hidden outline outline-4">
      <thead>
        <tr className="bg-red-500 text-white">
          <th className="border p-2 first:rounded-tl-lg last:rounded-tr-lg">Room Name</th>
          <th className="border p-2">Admin</th>
          <th className="border p-2">Players</th>
          <th className="border p-2">State</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {roomsList.map((room) => (
          <tr key={room.room_name} className="hover:bg-red-300">
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
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-950"
                onClick={() => onSelect(room.room_name)}
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
