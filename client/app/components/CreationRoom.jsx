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
    <div className="flex items-center justify-center border-2 border-edge bg-surface rounded-lg p-4">
      <div className="text-center">
        <h2 className="text-3xl mb-4 text-accent-bright">Create your room</h2>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Enter your room name"
            value={roomInput}
            onChange={handleInputChange}
            className="w-full p-2"
          />
          <button
            className="mt-4 w-full px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hi disabled:bg-off disabled:text-muted transition-colors"
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
