import Board from './Board.js';
import { TETRIMINOS } from './const.js';
import Tetrimino from './Tetrimino.js';

class Game {
  constructor() {
    this.players = [];
    this.state = 'WAITING';
    this.interval = null;
    this.tetriminos_history = [];
  }

  getRandomKey() {
    const keys = Object.keys(TETRIMINOS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  updateTetriminosHistory() {
    let n_tetriminos_to_add = 0;
    if (this.tetriminos_history.length === 0) {
      n_tetriminos_to_add = 2;
    } else if (this.players.n_tetriminos + 2 < this.tetriminos_history.length) {
      n_tetriminos_to_add = 1;
    }

    for (let i = 0; i < n_tetriminos_to_add; i++) {
      this.tetriminos_history.push(this.getRandomKey());
    }
  }

  manageTetriminosPlayers(player) {
    this.updateTetriminosHistory();
    if (player.tetrimino === null) {
      player.tetrimino = new Tetrimino(this.tetriminos_history[player.n_tetriminos]);
      player.n_tetriminos += 1;
    }
  }

  update() {
    console.log('update');
    this.players.forEach((player) => {
      this.manageTetriminosPlayers(player);
    });
    this.players.forEach((player) => {
      player.socket.emit('update', {
        board: player.board.gridWithCurrentTetrimino(player.tetrimino),
        score: player.score,
        currentTetrimino: player.tetrimino.getShape(),
        nextTetriminos: this.tetriminos_history.slice(player.n_tetriminos, player.n_tetriminos + 2),
      });
    });
  }

  start(players) {
    console.log('start');
    this.state = 'STARTED';
    this.players = players;
    this.players.forEach((player) => {
      player.score = 0;
      player.board = new Board();
      player.n_tetriminos = 0;
      player.tetrimino = null;
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
