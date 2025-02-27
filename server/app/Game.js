class Game {
  constructor() {
    this.players = [];
    this.state = 'WAITING';
    this.interval = null;
    this.tetriminos_history = [];
  }

  update() {
    this.players.forEach((player) => {});
  }

  start(players) {
    this.state = 'STARTED';
    this.players = players;
    this.players.forEach((player) => {
      player.score = 0;
    });

    this.players.forEach((player) => {
      player.socket.emit('gameStarted');
    });
    this.interval = setInterval(() => {
      this.update();
    }, 1000);
  }
}

export default Game;
