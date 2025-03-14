import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const CreationRoom = ({ handleSelectRoom }) => {
  const [roomInput, setRoomInput] = useState('');
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setRoomInput(event.target.value);
  };

  const handleCreateRoom = (event) => {
    console.log('handleCreateRoom', roomInput);
    event.preventDefault();
    if (roomInput.trim()) {
      handleSelectRoom(roomInput);
    }
  };

  return (
    <div className="flex items-center justify-center border-2 border-white rounded-lg p-4">
      <div className="text-center">
        <h2 className="text-3xl mb-4">Create your room</h2>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Enter your room name"
            value={roomInput}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
          <button className="mt-4 w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-950">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreationRoom;
