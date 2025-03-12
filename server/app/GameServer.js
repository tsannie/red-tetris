import Room from './Room.js';
import Player from './Player.js';

class GameServer {
  constructor() {
    this.rooms = {};
    this.players = [];
    this.visitors = [];
  }

  addVisitor(socket) {
    this.visitors.push(socket);
  }

  removeVisitor(socket) {
    this.visitors = this.visitors.filter((visitor) => visitor !== socket);
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

  getAllRooms() {
    return Object.keys(this.rooms).map((name) => ({
      room_name: name,
      nb_players: this.rooms[name].players.length,
      admin_id: this.rooms[name].admin_id,
      admin_username: this.getPlayerById(this.rooms[name].admin_id).pseudo,
      state: this.rooms[name].getState(),
    }));
  }

  updateRoomsList() {
    const rooms = this.getAllRooms();
    this.visitors.forEach((visitor) => {
      visitor.emit('updateRoomsList', rooms);
    });
  }

  joinOrCreateRoom(name, player) {
    let room = this.getRoomByName(name);
    if (room) {
      room.addPlayer(player);
    } else {
      room = this.createRoom(name, player);
    }
    this.updateRoomsList();
    return room;
  }

  getRoomByName(name) {
    return this.rooms[name];
  }
}

export default GameServer;
