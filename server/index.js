const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Change this if your frontend has a different URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  setInterval(() => {
    socket.emit('updateGame', { time: new Date().toISOString() });
  }, 1000);

  setInterval(() => {
    const newPiece = generateNewPiece();
    socket.emit('newPiece', newPiece);
  }, 5000);

  function generateNewPiece() {
    const pieces = ['.'];
    const randomIndex = Math.floor(Math.random() * pieces.length);
    return pieces[randomIndex];
  }
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});
