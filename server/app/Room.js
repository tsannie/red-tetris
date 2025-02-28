import Game from './Game.js';

class Room {
  constructor(id, name, playerAdmin) {
    this.id = id;
    this.name = name;
    this.players = [playerAdmin];
    this.idAdmin = playerAdmin.id;
    this.game = new Game();
  }

  startGame() {
    this.game.start(this.players);
  }

  addPlayer(player) {
    this.players.push(player);
  }
}

export default Room;
