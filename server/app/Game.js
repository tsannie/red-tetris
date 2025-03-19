import Board from './Board.js';
import { BOARD_HEIGHT, TETRIMINOS } from './const.js';
import Tetrimino from './Tetrimino.js';

class Game {
  constructor() {
    this.players = [];
    this.state = "WAITING";
    this.interval = null;
    this.tetriminos_history = []; // doit toujours etre superieur aux max de player.n_tetriminos
    this.gameInterval = 3000;
    this.refreshInterval = 0
  }

  getRandomKey() {
    const keys = Object.keys(TETRIMINOS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  updateTetriminosHistory(player) {
    let n_tetriminos_to_add = 0;
    if (this.tetriminos_history.length === 0) {
      n_tetriminos_to_add = 2;
    } else if (player.n_tetriminos + 2 > this.tetriminos_history.length) {
      n_tetriminos_to_add = 1;
    }

    for (let i = 0; i < n_tetriminos_to_add; i++) {
      this.tetriminos_history.push(this.getRandomKey());
    }
  }

  manageTetriminosPlayers(player) {
    this.updateTetriminosHistory(player);
    if (player.tetrimino === null) {
      player.tetrimino = new Tetrimino(
        this.tetriminos_history[player.n_tetriminos]
      );
      player.n_tetriminos += 1;
    }
  }

  retrievePlayerScore() {
    const score =  this.players.map(player => ({
      pseudo: player.pseudo,
      score: player.score,
    }));
    return score
  }

  update() {
    this.players.forEach((player) => {
      if (player.tetrimino) {
        player.move([0, 1])
      }
      this.manageTetriminosPlayers(player);
    });
    this.players.forEach((player) => {
      player.socket.emit("update", {
        board: player.board.gridWithCurrentTetrimino(player.tetrimino, false),
        score: this.retrievePlayerScore(),
        currentTetrimino: player.tetrimino.getShape(),
        nextTetriminos: this.tetriminos_history.slice(
          player.n_tetriminos,
          player.n_tetriminos + 2
        ),
      });
    });
    this.refreshInterval += 1
    if (this.refreshInterval > 8) {
      this.startWithNewInterval(this.gameInterval - 250)
      this.refreshInterval = 0
    }
  }

  gameFinished() {
    this.state = "FINISHED"
    console.log("emit Finished")
    this.players.forEach((player) => {
      player.socket.emit("gameFinished")
    })
  }

  start(players) {
    this.state = "STARTED";
    this.players = players;
    this.players.forEach((player) => {
      player.game = this;
      player.score = 0;
      player.board = new Board();
      player.n_tetriminos = 0;
      player.tetrimino = null;
    });
    
    this.players.forEach((player) => {
      player.socket.emit("gameStarted");
    });
    this.update();
    this.interval = setInterval(() => {
      this.update();
    }, this.gameInterval);
  }

  startWithNewInterval(intervalTime) {
    if (intervalTime < 250) return;
    this.gameInterval = intervalTime
    console.log("changement de rythme", this.gameInterval)
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.update();
    }, this.gameInterval);
  }

  addPenalities(playerId) {
    this.players.forEach((player) => {
      if (!(player.id == playerId)) {
        player.penalities()
      }
    });
  }
}

export default Game;
