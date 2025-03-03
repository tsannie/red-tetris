import Tetrimino from "./Tetrimino.js";

class Player {
  constructor(id, pseudo, socket) {
    this.socket = socket;
    this.id = id;
    this.pseudo = pseudo;
    this.score = 0;
    this.board = null;
    this.n_tetriminos = 0;
    this.tetrimino = null;
  }

  updateScore(points) {
    this.score += points;
  }

  move(vector) {
    let tetrimino_to_test = Tetrimino.clone(this.tetrimino)
    tetrimino_to_test.move(vector);
    const number_of_t_before_move = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(this.tetrimino)
    );
    const number_of_t_after_move = this.board.numberOfTOnGrid(
      this.board.gridWithCurrentTetrimino(tetrimino_to_test)
    );
    if (number_of_t_after_move!=number_of_t_before_move){
      return false
    }
    else {
      this.tetrimino.move(vector)
      return true
    }
  }
}

export default Player;
