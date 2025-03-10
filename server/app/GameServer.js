import Room from './Room.js';
import Player from './Player.js';

class GameServer {
  constructor() {
    this.rooms = {};
    this.players = [];
  }

  createPlayer(pseudo, socket) {
    const player = new Player(pseudo, socket);
    this.players.push(player);

    socket.emit('login_success', {
      id: player.id,
      pseudo: player.pseudo,
    });

    return player;
  }

  deletePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  createRoom(name, playerAdmin) {
    this.rooms[name] = new Room(name, playerAdmin);
    return this.rooms[name];
  }

  joinOrCreateRoom(name, player) {
    let room = this.getRoomByName(name);
    if (room) {
      room.addPlayer(player);
    } else {
      room = this.createRoom(name, player);
    }
    return room;
  }

  getRoomByName(name) {
    return this.rooms[name];
  }
}

export default GameServer;
