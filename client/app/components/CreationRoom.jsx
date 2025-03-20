import React, { useState } from 'react';

const isValidRoomName = (name) => {
  const regex = /^[a-zA-Z0-9_]{1,15}$/;
  return regex.test(name);
};

const CreationRoom = ({ handleSelectRoom }) => {
  const [roomInput, setRoomInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setRoomInput(newValue);

    // Vérifie la validité du nom en temps réel
    if (!isValidRoomName(newValue)) {
      setError('Only letters, numbers, and "_" allowed (1-15 characters).');
    } else {
      setError('');
    }
  };

  const handleCreateRoom = (event) => {
    event.preventDefault();
    if (isValidRoomName(roomInput)) {
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
          <button
            className="mt-4 w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-950 disabled:bg-red-400"
            disabled={!isValidRoomName(roomInput)}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreationRoom;
