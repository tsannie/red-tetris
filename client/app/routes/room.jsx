import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoomsList, selectUsername } from '../redux/roomInfoSlice';
import { useNavigate } from 'react-router';
import { emitGetRooms } from '../redux/socketSlice';

const Room = () => {
  const username = useSelector((state) => selectUsername(state));
  const roomsList = useSelector((state) => selectRoomsList(state));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(emitGetRooms());
  }, []);

  const handleSelectRoom = (roomName) => {
    navigate(`/${username}/${roomName}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Room Selection</h1>
      <p className="mb-4">Hello {username}</p>
      <table className="w-full border-collapse border rounded-lg overflow-hidden outline outline-4">
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
          {roomsList.map((room, index) => (
            <tr
              key={room.room_name}
              className={`hover:bg-red-300 ${index === roomsList.length - 1 ? 'last:rounded-b-lg' : ''}`}
            >
              <td className="border p-2">{room.room_name}</td>
              <td className="border p-2">{room.admin_username}</td>
              <td className="border p-2">{room.nb_players}</td>
              <td className="border p-2">{room.state}</td>
              <td className="border p-2">
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-950"
                  onClick={() => handleSelectRoom(room.room_name)}
                >
                  Join
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Room;
