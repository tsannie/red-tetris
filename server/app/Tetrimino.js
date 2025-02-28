import { BOARD_HEIGHT, BOARD_WIDTH, TETRIMINOS } from './const.js';

class Tetrimino {
  constructor(key) {
    this.shape = TETRIMINOS[key].shape;
    //this.color = color;
    this.position = [BOARD_WIDTH / 2, Math.ceil(this.shape[0].length / 2)];
    this.rotation = 0;
  }

  rotate() {
    this.rotation = (this.rotation + 1) % this.shape.length;
  }

  move(vector) {
    this.position.x += vector.x;
    this.position.y += vector.y;
  }

  getShape() {
    return this.shape[this.rotation];
  }
}

export default Tetrimino;
