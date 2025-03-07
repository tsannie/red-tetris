import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../redux/userSlice';
import { useNavigate } from 'react-router';

export function meta() {
  return [{ title: 'Login' }, { name: 'description', content: 'Login page' }];
}

const Login = () => {
  const [pseudoInput, setPseudoInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setPseudoInput(event.target.value);
  };

  const handleLogin = () => {
    if (pseudoInput.trim()) {
      dispatch(setUsername(pseudoInput));
      navigate('/room');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="pseudo" className="text-lg font-medium text-gray-700">
        Enter your pseudo:
      </label>
      <input type="text" id="pseudo" value={pseudoInput} onChange={handleInputChange} />
      <button onClick={handleLogin} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Log in
      </button>
    </div>
  );
};

export default Login;
