import { connect, updateRoom } from './socketSlice';
import io from 'socket.io-client';
import { userSlice } from './userSlice';

const SERVER_URL = 'http://localhost:4000';

let socket = null; // Singleton

const loginUser = async (socket, pseudo) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject(new Error('Socket not connected'));
    }

    socket.emit('login', { pseudo });

    socket.on('login_success', (data) => {
      resolve(data);
    });

    socket.on('login_error', (error) => {
      reject(error);
    });
  });
};

const middleware = (store) => (next) => async (action) => {
  switch (action.type) {
    case 'socket/connectionAttempt':
      if (!socket) {
        socket = io(SERVER_URL, {
          transports: ['websocket'],
        });

        socket.on('connect', () => {
          store.dispatch(connect(socket));
        });

        socket.on('update', (data) => {
          store.dispatch(updateRoom(data));
        });
      }
      break;

    case 'socket/emitJoinOrCreateRoom':
      if (socket) {
        socket.emit('joinOrCreateRoom', action.payload);
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/disconnect':
      if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected');
      }
      break;

    case 'user/logout':
      if (socket) {
        socket.emit('logout', { id: action.payload });
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'user/login':
      try {
        const data = await loginUser(socket, action.payload);
        store.dispatch(userSlice.actions.setId(data.id));
        store.dispatch(userSlice.actions.setUsername(data.pseudo));
      } catch (error) {
        console.error('Login failed:', error);
      }
      break;

    default:
      break;
  }
  return next(action);
};

export default middleware;
