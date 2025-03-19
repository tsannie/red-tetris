import { BOARD_HEIGHT, BOARD_WIDTH, TETRIMINOS } from './const.js';

class Tetrimino {
  constructor(key) {
    this.shape = TETRIMINOS[key].shape;
    this.color = TETRIMINOS[key].color;
    this.position = [BOARD_WIDTH / 2,  -1]
    this.rotation = 0;
    this.isInserting = true;
  }

  // Méthode statique pour créer une copie
  static clone(original) {
    // Crée une copie profonde des données
    const copy = structuredClone(original);
    Object.setPrototypeOf(copy, Tetrimino.prototype);
    return copy;
  }

  rotate() {
    this.rotation = (this.rotation + 1) % this.shape.length;
  }

  move(vector) {
    this.position[0] += vector[0];
    this.position[1] += vector[1];
  }

  getShape() {
    return this.shape[this.rotation];
  }

  getColor() {
    return this.color;
  }
}

export default Tetrimino;
