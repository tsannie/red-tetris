import React from 'react';
import { useDispatch } from 'react-redux';
import { emitExitRoom } from '../redux/socketSlice';
import { useNavigate } from 'react-router';

const ExitButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleExit = () => {
    dispatch(emitExitRoom());
    dispatch;
    navigate('/rooms');
  };

  return (
    <button
      onClick={handleExit}
      className="fixed top-2 left-2 mt-4 w-30 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hi disabled:bg-off disabled:text-muted transition-colors"
    >
      Leave Room
    </button>
  );
};

export default ExitButton;
