import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../redux/roomInfoSlice';
import { useNavigate } from 'react-router';

export function meta() {
  return [{ title: 'Login' }, { name: 'description', content: 'Login page' }];
}

// Validation function
const isValidName = (name) => {
  const regex = /^[a-zA-Z0-9_]{1,15}$/;
  return regex.test(name);
};

const Login = () => {
  const [pseudoInput, setPseudoInput] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setPseudoInput(newValue);

    if (!isValidName(newValue)) {
      setError('Only letters, numbers, and "_" allowed (1-15 characters).');
    } else {
      setError('');
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (isValidName(pseudoInput)) {
      dispatch(setUsername(pseudoInput));
      navigate('/rooms');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-3xl mb-4">Your name</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your pseudo"
            value={pseudoInput}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
          <button
            className="mt-4 w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-950 disabled:bg-red-400"
            disabled={!isValidName(pseudoInput)}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
