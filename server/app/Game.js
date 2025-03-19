import { finished } from 'stream';
import Board from './Board.js';
import { BOARD_HEIGHT, STATE, TETRIMINOS } from './const.js';
import Tetrimino from './Tetrimino.js';

class Game {
  constructor() {
    this.typeOfGame = "SOLO" // "SOLO" OU "MULTI"
    this.players = [];
    this.state = STATE.WAITING;
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
      let newTetri = new Tetrimino(
        this.tetriminos_history[player.n_tetriminos]
      );
      let numberOfBlockBefore = player.board.numberOfTOnGrid(player.board.grid)
      let numberOfBlockAfter = player.board.numberOfTOnGrid(player.board.gridWithCurrentTetrimino(newTetri))
      // console.log(n)
      if (numberOfBlockAfter !== numberOfBlockBefore + 4) this.gameFinished(player.id)
      player.tetrimino = newTetri
      player.n_tetriminos += 1;
    }
  }

  retrievePlayerBoard(player) {
    const otherPlayersGame =  this.players.filter(otherPlayer => otherPlayer !== player)
    .map(otherPlayer => ({
      pseudo: otherPlayer.pseudo,
      state: otherPlayer.state,
      grid: otherPlayer.grid,
    }));
    return otherPlayersGame
  }

  update() {
    this.players.forEach((player) => {
      if (player.tetrimino) {
        player.move([0, 1])
      }
      this.manageTetriminosPlayers(player);
    });
    this.players.forEach((player) => {
      if (player.state === STATE.STARTED) {
        player.socket.emit('update', {
          board: player.gridWithCurrentTetriminoWithShadow(),
          otherPlayers: this.retrievePlayerBoard(player),
          currentTetrimino: player.tetrimino.getShape(),
          nextTetriminos: this.tetriminos_history.slice(
            player.n_tetriminos,
            player.n_tetriminos + 2
          ),
        });
      }
    });
    this.refreshInterval += 1
    if (this.refreshInterval > 8) {
      this.startWithNewInterval(this.gameInterval - 250)
      this.refreshInterval = 0
    }
  }

  gameFinished(playerId) {
    let player = this.players.find(player => player.id === playerId)
    console.log("emit finished")
    player.state = STATE.FINISHED
    player.socket.emit('finished', {
      idPlayer: player.id,
      pseudo: player.pseudo
    })
    if (this.typeOfGame == "SOLO"){
      console.log("SOLO")
      this.state = STATE.FINISHED
      console.log("emit gameFinished")
      player.socket.emit("gameFinished")
    } else if (this.players.filter((element) => element.state == STATE.STARTED).length == 1){
      console.log("MULTI")
      this.players.forEach((playerInGame) => {
        if (playerInGame.state == STATE.STARTED){
          playerInGame.state = STATE.FINISHED
          console.log("emit finished")
          playerInGame.socket.emit('finished', {
            idPlayer: playerInGame.id,
            pseudo: playerInGame.pseudo
          })
        }
      })
      console.log("emit gameFinished")
      player.socket.emit("gameFinished")
    }
  }

  start(players) {
    if (players.length > 1) this.typeOfGame="MULTI"
    this.state = STATE.STARTED;
    this.players = players;
    this.players.forEach((player) => {
      player.game = this;
      player.board = new Board();
      player.n_tetriminos = 0;
      player.tetrimino = null;
      player.state = STATE.STARTED
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
