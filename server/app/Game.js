import { finished } from 'stream';
import Board from './Board.js';
import { BOARD_HEIGHT, STATE, TETRIMINOS } from './const.js';
import Tetrimino from './Tetrimino.js';

class Game {
  constructor() {
    this.typeOfGame = 'SOLO'; // "SOLO" OU "MULTI"
    this.players = [];
    this.state = STATE.WAITING;
    this.interval = null;
    this.tetriminos_history = []; // doit toujours etre superieur aux max de player.n_tetriminos
    this.gameInterval = 3000;
    this.refreshInterval = 0;
    this.lastWinnerId = null;
  }

  resetAttrib() {
    this.state = STATE.WAITING;
    this.interval = null;
    this.tetriminos_history = []; // doit toujours etre superieur aux max de player.n_tetriminos
    this.gameInterval = 3000;
    clearInterval(this.interval);
    this.refreshInterval = 0;
    this.players.forEach((player) => {
      player.board = new Board();
      player.n_tetriminos = 0;
      player.tetrimino = null;
      player.state = STATE.WAITING;
    })
  }

  getRandomKey() {
    const keys = Object.keys(TETRIMINOS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  updateTetriminosHistory(player) {
    let n_tetriminos_to_add = 0;
    if (player.n_tetriminos + 2 > this.tetriminos_history.length) {
      n_tetriminos_to_add = player.n_tetriminos + 2 - this.tetriminos_history.length;
    }

    for (let i = 0; i < n_tetriminos_to_add; i++) {
      this.tetriminos_history.push(new Tetrimino(this.getRandomKey()));
    }
  }

  manageTetriminosPlayers(player) {
    if (player.tetrimino === null) {
      let newTetri = Tetrimino.clone(this.tetriminos_history[player.n_tetriminos]);
      let numberOfBlockBefore = player.board.numberOfTOnGrid(player.board.grid);
      let numberOfBlockAfter = player.board.numberOfTOnGrid(player.board.gridWithCurrentTetrimino(newTetri));
      if (numberOfBlockAfter !== numberOfBlockBefore + 4) {
        player.socket.emit('update', {
          board: player.board.grid,
          otherPlayers: this.retrievePlayerBoard(player),
          currentTetrimino: this.tetriminos_history[player.n_tetriminos].getShapeWithColor(),
          nextTetriminos: this.nextTetriminosWithColor(player),
        });
        this.gameFinished(player.id);
      }
      player.tetrimino = newTetri;
      player.n_tetriminos += 1;
    }
    this.updateTetriminosHistory(player);
  }

  retrievePlayerBoard(player) {
    const otherPlayersGame = this.players
      .filter((otherPlayer) => otherPlayer !== player)
      .map((otherPlayer) => ({
        pseudo: otherPlayer.pseudo,
        state: otherPlayer.state,
        grid: otherPlayer.board.grid,
      }));
    return otherPlayersGame;
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  update() {
    this.players.forEach((player) => {
      if (player.tetrimino) {
        player.move([0, 1]);
      }
      this.manageTetriminosPlayers(player);
    });
    this.players.forEach((player) => {
      if (player.state === STATE.STARTED) {
        player.socket.emit('update', {
          board: player.gridWithCurrentTetriminoWithShadow(),
          otherPlayers: this.retrievePlayerBoard(player),
          currentTetrimino: player.tetrimino.getShapeWithColor(),
          nextTetriminos: this.nextTetriminosWithColor(player),
        });
      }
    });
    this.refreshInterval += 1;
    if (this.refreshInterval > 8) {
      this.startWithNewInterval(this.gameInterval - 250);
      this.refreshInterval = 0;
    }
  }

  nextTetriminosWithColor(player) {
    let nextTetriminos = this.tetriminos_history.slice(player.n_tetriminos, player.n_tetriminos + 2);
    nextTetriminos[0] = nextTetriminos[0].getShapeWithColor();
    nextTetriminos[1] = nextTetriminos[1].getShapeWithColor();
    return nextTetriminos;
  }

  gameFinished(playerId) {
    let player = this.players.find((player) => player.id === playerId);
    player.state = STATE.WAITING;
    this.players.forEach((sender) => {
      sender.socket.emit('finished', {
        idPlayer: player.id,
        pseudo: player.pseudo,
      });
    });
    if (this.typeOfGame == 'SOLO') {
      this.lastWinnerId = player.id;
      player.socket.emit('gameFinished', {
        idPlayer: player.id,
        pseudo: player.pseudo,
      });
      this.resetAttrib();
    } else if (this.players.filter((element) => element.state == STATE.STARTED).length == 1) {
      this.players.forEach((playerInGame) => {
        if (playerInGame.state == STATE.STARTED) {
          this.lastWinnerId = playerInGame.id;
          playerInGame.state = STATE.FINISHED;
          playerInGame.socket.emit('finished', {
            idPlayer: playerInGame.id,
            pseudo: playerInGame.pseudo,
          });
        }
      });
      player.socket.emit('gameFinished', {
        idPlayer: player.id,
        pseudo: player.pseudo,
      });
      this.resetAttrib();
    }
  }

  start(players) {
    if (players.length > 1) this.typeOfGame = 'MULTI';
    this.state = STATE.STARTED;
    this.players = players;
    this.players.forEach((player) => {
      player.game = this;
      player.board = new Board();
      player.n_tetriminos = 0;
      player.tetrimino = null;
      player.state = STATE.STARTED;
      this.updateTetriminosHistory(player);
    });
    this.players.forEach((player) => {
      player.socket.emit('gameStarted');
    });
    this.update();
    this.interval = setInterval(() => {
      this.update();
    }, this.gameInterval);
  }

  startWithNewInterval(intervalTime) {
    if (intervalTime < 250) return;
    this.gameInterval = intervalTime;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, this.gameInterval);
  }

  addPenalities(playerId) {
    this.players.forEach((player) => {
      if (!(player.id == playerId)) {
        player.penalities();
      }
    });
  }

  delete() {
    clearInterval(this.interval);
    this.players = [];
    this.state = STATE.WAITING;
    this.tetriminos_history = [];
  }
}

export default Game;
