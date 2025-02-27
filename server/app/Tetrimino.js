import { BOARD_HEIGHT, BOARD_WIDTH, TETRIMINOS } from './const';

class Tetrimino {
  constructor(key, color) {
    this.shape = TETRIMINOS[key].shape;
    this.color = color;
    this.position = { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT - Math.ceil(this.shape[0].length / 2) };
    this.rotation = 0;
    this.position[1] -= Math.floor(this.shape[this.rotation].length / 2);
  }

  rotate() {
    this.rotation = (this.rotation + 1) % this.shape.length;
  }
}

export default Tetrimino;
