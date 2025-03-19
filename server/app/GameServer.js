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

  playerLeaveRoom(player, room) {
    const state_room = room.getState();
    if (state_room === 'WAITING' || state_room === 'STARTED') {
      room.removePlayer(player);
      if (room.getNbPlayers() === 0) {
        console.log('remove room', room.name);
        this.removeRoom(room);
      } else {
        if (player.id === room.admin_id) {
          room.newAdmin();
        } else {
          room.updateInfoRoom();
        }
        console.log('CA VA CRASHER');
        this.updateRoomsList();
      }
    }
    console.log('Fin de la suppression');
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

  removeRoom(room) {
    if (!room) return;
    this.rooms[room.name] = null;
    delete this.rooms[room.name];
    this.updateRoomsList();
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

  getRoomByName(name) {
    return this.rooms[name];
  }

  roomIsFull(name) {
    const room_to_join = this.getRoomByName(name);
    if (room_to_join && room_to_join.getNbPlayers() >= 5) {
      return true;
    }
    return false;
  }

  roomIsStarted(name) {
    const room_to_join = this.getRoomByName(name);
    if (room_to_join && room_to_join.getState() !== 'WAITING') {
      return true;
    }
    return false;
  }

  updateRoomsList() {
    const rooms = this.getAllRooms();
    console.log('rooms', rooms);
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
