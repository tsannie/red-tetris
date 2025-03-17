import { STATE } from "./const.js";
import Tetrimino from "./Tetrimino.js";
import { generateUniqueUserId } from "./utils.js";

class Player {
  constructor(pseudo, socket) {
    this.socket = socket;
    this.id = generateUniqueUserId();
    this.pseudo = pseudo;
    this.score = 0;
    this.board = null;
    this.n_tetriminos = 0;
    this.tetrimino = null;
    this.game = null;
    this.state = STATE.FINISHED;
  }

  updateScore(points) {
    this.score += points;
  }

  canMove(vector) {
    let tetrimino_to_test = Tetrimino.clone(this.tetrimino);
    tetrimino_to_test.move(vector);
    const number_of_t_before_move = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(this.tetrimino)
    );
    const number_of_t_after_move = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(tetrimino_to_test)
    );
    return number_of_t_before_move === number_of_t_after_move;
  }

  canRotate() {
    let tetrimino_to_test = Tetrimino.clone(this.tetrimino);
    tetrimino_to_test.rotate();
    const number_of_t_before_rotate = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(this.tetrimino)
    );
    const number_of_t_after_rotate = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(tetrimino_to_test)
    );
    return number_of_t_before_rotate === number_of_t_after_rotate;
  }

  move(vector) {
    if (!this.tetrimino) return false;
    if (!this.canMove(vector)){
      if (vector[0] == 0 && vector[1] == 1){
        const penalities = this.board.keepTetriminoOnBoard(this.tetrimino)
        for (let i = 0; i < penalities; i++){
          console.log("Emit Penalities")
          this.game.addPenalities(this.id)
          this.socket.emit("penalitiesOtherPlayer", this.id)
        }
        this.tetrimino = null;
        this.game.manageTetriminosPlayers(this)
      }
      return false;
    }
    this.tetrimino.move(vector);
    return true;
  }

  drop() {
    const currentTetrimino = this.n_tetriminos
    while (currentTetrimino == this.n_tetriminos) {
      this.move([0, 1])
    }
  }

  penalities() {
    this.board.addLineOfTetriminos()
  }

  rotate() {
    if (!this.canRotate()) return false;
    this.tetrimino.rotate();
    return true;
  }
}

export default Player;
