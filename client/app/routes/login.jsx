import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPseudo } from '../redux/pseudoSlice';
import { useNavigate } from 'react-router';

export function meta() {
  return [{ title: 'Login' }, { name: 'description', content: 'Login page' }];
}

const Login = () => {
  const [pseudo, setPseudoInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* useEffect(() => {
    console.log('Connecting to the server...');
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Connection established with the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    return () => {
      socket.disconnect();
    };
  }, []); */

  const handleInputChange = (event) => {
    setPseudoInput(event.target.value);
  };

  const handleLogin = () => {
    if (pseudo.trim()) {
      dispatch(setPseudo(pseudo));
      navigate('/room');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="pseudo" className="text-lg font-medium text-gray-700">
        Enter your pseudo:
      </label>
      <input type="text" id="pseudo" value={pseudo} onChange={handleInputChange} />
      <button onClick={handleLogin} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Log in
      </button>
    </div>
  );
};

export default Login;
