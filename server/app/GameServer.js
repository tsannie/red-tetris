import Room from './Room.js';
import Player from './Player.js';

class GameServer {
  constructor() {
    this.rooms = {};
    this.players = [];
  }

  createPlayer(id, pseudo, socket) {
    const player = new Player(id, pseudo, socket);
    this.players.push(player);

    socket.emit('login', {
      id: player.id,
      pseudo: player.pseudo,
    });

    return player;
  }

  createRoom(id, name, playerAdmin) {
    this.rooms[id] = new Room(id, name, playerAdmin);
    return this.rooms[id];
  }

  deleteRoom(id) {
    delete this.rooms[id];
  }

  deletePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  getRoomById(id) {
    return this.rooms[id];
  }
}

export default GameServer;
