import { connect, updateRoom } from './socketSlice';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

let socket = null; // Singleton

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

        socket.on('updateInfoRoom', (data) => {
          console.log('infoRoom', data);
        });
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitMove':
      if (socket) {
        socket.emit('move', action.payload);
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

    default:
      break;
  }
  return next(action);
};

export default middleware;
