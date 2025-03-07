import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import GameServer from './app/GameServer.js';
import { direction_vector } from './app/utils.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
const gameServer = new GameServer();
io.on('connect', (socket) => {
  let room = null;
  let player = null;

  console.log('A user connected:', socket.id);

  socket.on('joinOrCreateRoom', (data) => {
    player = gameServer.createPlayer(data.username, socket);
    room = gameServer.joinOrCreateRoom(data.room_name, player);

    room.startGame();
  });

  socket.on('move', (direction) => {
    if (!room || !player || direction_vector[direction] === undefined) return; // TODO also check if the game is started
    if (player.move(direction_vector[direction])) {
      room.updatePlayerState(player);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});
