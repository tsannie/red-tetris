import { setAdminId, setPlayers, setRoomName, setRoomsList, setUserId } from './roomInfoSlice';
import { connect, setRoomError, reset, updateRoom } from './socketSlice';
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
          console.log('update', data);
          store.dispatch(updateRoom(data));
        });

        socket.on('updateInfoRoom', (data) => {
          store.dispatch(setPlayers(data.players));
          store.dispatch(setAdminId(data.admin_id));
          store.dispatch(setUserId(data.user_id));
        });

        socket.on('updateRoomsList', (data) => {
          store.dispatch(setRoomsList(data));
        });

        socket.on('roomError', (data) => {
          console.log('Room ERROR:', data.message);
          store.dispatch(setRoomError(true));
        });
      }
      break;

    case 'socket/emitStart':
      if (socket) {
        socket.emit('startGame');
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitExitRoom':
      if (socket) {
        socket.emit('exitRoom');
        store.dispatch(setRoomName(null));
        store.dispatch(reset());
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitGetRooms':
      if (socket) {
        socket.emit('getRoomsList');
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitJoinOrCreateRoom':
      if (socket) {
        socket.emit('joinOrCreateRoom', action.payload);
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

    case 'socket/emitDrop':
      if (socket) {
        socket.emit('drop');
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitRotate':
      if (socket) {
        socket.emit('rotate');
      } else {
        console.error('Socket not connected');
      }
      break;

    case 'socket/emitStart':
      if (socket) {
        socket.emit('startGame');
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
