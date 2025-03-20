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
  gameServer.addVisitor(socket);

  socket.on('joinOrCreateRoom', (data) => {
    player = gameServer.createPlayer(data.username, socket);
    room = gameServer.joinOrCreateRoom(data.room_name, player);

    room.updateInfoRoom();
  });

  socket.on('exitRoom', () => {
    if (!room || !player) return;

    gameServer.playerLeaveRoom(player, room);
    room = null;
    player = null;
  });

  socket.on('startGame', () => {
    if (!room || !player || room.admin_id !== player.id) return; // TODO check state of room

    room.startGame();
    gameServer.updateRoomsList();
  });

  socket.on('move', (direction) => {
    if (!room || !player || direction_vector[direction] === undefined) return; // TODO also check if the game is started
    if (player.move(direction_vector[direction])) {
      room.updatePlayerState(player);
    }
  });

  socket.on('rotate', () => {
    if (!room || !player) return; // TODO also check if the game is started
    if (player.rotate()) {
      room.updatePlayerState(player);
    }
  });

  socket.on('drop', () => {
    if (!room || !player) return; // TODO also check if the game is started
    player.drop();
    room.updatePlayerState(player);
  });

  socket.on('getRoomsList', () => {
    const rooms = gameServer.getAllRooms();
    socket.emit('updateRoomsList', rooms);
  });

  socket.on('disconnect', () => {
    if (room && player) {
      gameServer.playerLeaveRoom(player, room);
    }

    gameServer.removeVisitor(socket);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});
