import Game from './Game.js';

class Room {
  constructor(name, playerAdmin) {
    this.name = name;
    this.players = [playerAdmin];
    this.idAdmin = playerAdmin.id;
    this.game = new Game();
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
}

export default Room;
