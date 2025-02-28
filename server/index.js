import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import GameServer from './app/GameServer.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Change this if your frontend has a different URL
    methods: ['GET', 'POST'],
  },
});
const gameServer = new GameServer();
let room_id = 0;
let player_id = 0;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const player = gameServer.createPlayer(player_id, 'tester', socket);
  player_id += 1;
  const room = gameServer.createRoom(room_id, 'test', player);
  room_id += 1;

  room.startGame();

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});
