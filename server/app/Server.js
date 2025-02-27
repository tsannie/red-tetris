class Server {
  constructor() {
    this.rooms = {};
    this.players = {};
  }

  createRoom(roomId) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
      console.log(`Room ${roomId} created.`);
    } else {
      console.log(`Room ${roomId} already exists.`);
    }
  }

  addPlayerToRoom(roomId, playerId) {
    if (this.rooms[roomId]) {
      if (!this.players[playerId]) {
        this.players[playerId] = roomId;
        this.rooms[roomId].push(playerId);
        console.log(`Player ${playerId} added to room ${roomId}.`);
      } else {
        console.log(`Player ${playerId} is already in a room.`);
      }
    } else {
      console.log(`Room ${roomId} does not exist.`);
    }
  }

  removePlayerFromRoom(playerId) {
    const roomId = this.players[playerId];
    if (roomId) {
      const room = this.rooms[roomId];
      this.rooms[roomId] = room.filter((id) => id !== playerId);
      delete this.players[playerId];
      console.log(`Player ${playerId} removed from room ${roomId}.`);
    } else {
      console.log(`Player ${playerId} is not in any room.`);
    }
  }

  deleteRoom(roomId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId].forEach((playerId) => {
        delete this.players[playerId];
      });
      delete this.rooms[roomId];
      console.log(`Room ${roomId} deleted.`);
    } else {
      console.log(`Room ${roomId} does not exist.`);
    }
  }
}

export default Server;
