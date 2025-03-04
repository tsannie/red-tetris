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

io.on('connection', (socket) => {
  const userId = generateUniqueUserId();
  console.log('A user connected:', userId);

  // socket.emit("userId", userId);

  const player = gameServer.createPlayer(userId, 'tester', socket);
  const room = gameServer.createRoom(room_id, 'test', player);
  room_id += 1;

  room.startGame();

  socket.on('move', (data) => {
    console.log(`Mouvement reçu: ${data.direction} de user ${userId}`);
    if ((data.direction === 'left') & player.move([-1, 0])) console.log('mouvement a gauche accepte');
    else if ((data.direction === 'right') & player.move([1, 0])) console.log('mouvement a gauche accepte');
    else if ((data.direction === 'down') & player.move([0, 1])) console.log('mouvement en bas accepte');
    io.emit('gameState', updatedGameState);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', userId);
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});

function generateUniqueUserId() {
  // Générer un identifiant unique, par exemple, un UUID ou un timestamp
  return 'user-' + Math.random().toString(36).substr(2, 9);
}
