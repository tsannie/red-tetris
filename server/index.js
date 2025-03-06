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

io.on('connect', (socket) => {
  console.log('Inside connect');
  console.log('A user connected:', socket.id);

  socket.on('login', (data) => {
    const userId = generateUniqueUserId();
    gameServer.createPlayer(userId, data.pseudo, socket);
    console.log('A user logged in:', data);
  });

  socket.on('logout', (data) => {
    //gameServer.deletePlayer(data.id);
    console.log('A user disconnected:', data);
  });

  socket.on('move', (data) => {
    // getThePlayerBySocketId
    console.log(`Mouvement reçu: ${data.direction} de user ${userId}`);
    const socket = this;
    console.log('socket:', socket);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});

function generateUniqueUserId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}
