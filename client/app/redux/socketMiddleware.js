import { connect } from './socketSlice';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

const socketMiddleware = (store) => {
  return (next) => (action) => {
    switch (action.type) {
      case 'socket/connectionAttempt':
        const socket = io(SERVER_URL);
        store.dispatch(connect(socket));

        socket.on('connect', () => {
          console.log('Connection established with the server');
        });
        break;

      default:
        break;
    }

    return next(action); // Passe l'action aux reducers
  };
};

export default socketMiddleware;
