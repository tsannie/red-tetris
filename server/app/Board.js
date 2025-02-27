import { BOARD_HEIGHT, BOARD_WIDTH } from './const';

class Board {
  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
  }
}

export default Board;
