import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/login.jsx'),
  route('room', 'routes/room.jsx'),
  route(':room/:player_name', 'routes/game.jsx'),
  //route('games', 'routes/game.jsx'),
];
