import { connect, updateRoom } from './socketSlice';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

let socket = null; // Singleton

const socketMiddleware = (store) => {
  return (next) => (action) => {
    switch (action.type) {
      case 'socket/connectionAttempt':
        if (!socket) {
          socket = io(SERVER_URL);

          socket.on('connect', () => {
            console.log('Connection established with the server');
          });

          socket.on('update', (data) => {
            store.dispatch(updateRoom(data));
          });

          store.dispatch(connect(socket));
        }
        break;

      case 'socket/disconnect':
        if (socket) {
          socket.disconnect();
          socket = null;
          console.log('Socket disconnected');
        }
        break;

      default:
        break;
    }

    return next(action); // Passe l'action aux reducers
  };
};

export default socketMiddleware;
