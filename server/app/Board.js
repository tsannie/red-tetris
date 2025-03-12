import { BOARD_HEIGHT, BOARD_WIDTH } from './const.js';

class Board {
  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
  }

  gridWithCurrentTetrimino(tetrimino, dev = false) {
    const grid = this.grid.map((row) => row.slice());
    const shape = tetrimino.getShape();

    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;
    const centerX = Math.floor(shapeWidth / 2);
    const centerY = Math.floor(shapeHeight / 2);
    const [posX, posY] = tetrimino.position;

    for (let y = 0; y < shapeHeight; y++) {
      for (let x = 0; x < shapeWidth; x++) {
        if (shape[y][x] === 1) {
          const gridX = posX - centerX + x;
          const gridY = posY - centerY + y;

          if (gridX >= 0 && gridX < BOARD_WIDTH && gridY >= 0 && gridY < BOARD_HEIGHT) {
            grid[gridY][gridX] = tetrimino.getColor()[0];
          }
        }
      }
    }
    if (dev) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        console.log(JSON.stringify(grid[y]));
      }
    }
    return grid;
  }

  // appeler cette fonction lorsque un tetrimino est arrive a la collision
  // et le rajouter au grid
  keepTetriminoOnBoard(tetrimino) {
    this.grid = this.gridWithCurrentTetrimino(tetrimino);
  }

  // cette fonction compte le nombre de '0' present sur le grid
  // elle va permettre de savoir si un move est possible
  numberOfTOnGrid(grid) {
    let number_of_tetri = 0;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      number_of_tetri += grid[y].filter((element) => element !== 0).length;
    }
    return number_of_tetri;
  }
}

export default Board;
