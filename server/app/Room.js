import Game from './Game.js';

class Room {
  constructor(name, admin_player) {
    this.name = name;
    this.players = [admin_player];
    this.admin_id = admin_player.id;
    this.game = new Game();
  }

  getState() {
    return this.game.state;
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

  updatePlayerState(player) {
    player.socket.emit('update', {
      board: player.board.gridWithCurrentTetrimino(player.tetrimino),
      score: player.score,
      currentTetrimino: player.tetrimino.getShape(),
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
      });
    });
  }
}

export default Room;
