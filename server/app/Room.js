import { STATE } from './const.js';
import Game from './Game.js';

class Room {
  constructor(name, admin_player) {
    this.name = name;
    this.players = [admin_player];
    this.admin_id = admin_player.id;
    this.game = new Game();
  }

  deleteGame() {
    this.game.delete();
    delete this.game;
    this.game = null;
    this.players = [];
    this.admin_id = null;
    this.name = null;
  }

  getNbPlayers() {
    return this.players.length;
  }

  getState() {
    return this.game.state;
  }

  newAdmin() {
    if (this.getNbPlayers() === 0) return;
    this.admin_id = this.players[0].id;
    this.updateInfoRoom();
  }

  movePlayer(player, direction) {
    this.game.movePlayer(player, direction);
  }

  startGame() {
    this.game.start(this.players);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.game.removePlayer(player);
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  updatePlayerState(player) {
    if (!(player.state === STATE.STARTED)) return;
    player.socket.emit('update', {
      board: player.gridWithCurrentTetriminoWithShadow(),
      otherPlayers: player.game.retrievePlayerBoard(player),
      currentTetrimino: player.tetrimino.getShapeWithColor(),
      nextTetriminos: player.game.nextTetriminosWithColor(player),
    });
  }

  updateInfoRoom() {
    // return { players: {id, pseudo}, id_admin }
    const players = this.players.map((player) => ({
      id: player.id,
      username: player.pseudo,
    }));
    this.players.forEach((player) => {
      player.socket.emit('updateInfoRoom', {
        players,
        admin_id: this.admin_id,
        user_id: player.id,
        last_winner_id: this.game.lastWinnerId,
      });
    });
  }
}

export default Room;
