import { connect, updateRoom } from './socketSlice';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

let socket = null; // Singleton

const middleware = (store) => {
  return (next) => (action) => {
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
        if (socket) {
          socket.emit('login', { pseudo: action.payload });

          socket.on('connect', (data) => {
            console.log('Connection established with the server');
            console.log('data:', data);
          });
        } else {
          console.error('Socket not connected');
        }
        break;

      default:
        break;
    }

    return next(action); // Passe l'action aux reducers
  };
};

export default middleware;
