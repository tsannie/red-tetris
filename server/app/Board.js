import { BOARD_HEIGHT, BOARD_WIDTH } from './const.js';

class Board {
  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
  }

  // exemple tetrimino.shape:
  // [ [ 0, 1, 0 ],
  //   [ 0, 1, 0 ],
  //   [ 0, 1, 1 ] ]
  // exemple tetrimino.position: [5, 18]
  // this function will insert the tetrimino in the grid with char 't'
  // with the '1' values of the shape at the position [5, 18]
  gridWithCurrentTetrimino(tetrimino, dev = false) {
    const grid = this.grid.map((row) => row.slice());
    const shape = tetrimino.getShape();
    if (dev)  console.log("try to insert tetrimino: ", shape);

    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;
    // console.log('shapeHeight: ', shapeHeight);
    // console.log('shapeWidth: ', shapeWidth);
    const centerX = Math.floor(shapeWidth / 2);
    const centerY = Math.floor(shapeHeight / 2);
    // console.log('centerX: ', centerX);
    // console.log('centerY: ', centerY);

    const [posX, posY] = tetrimino.position;
    // console.log('posX: ', posX);
    // console.log('posY: ', posY);

    for (let y = 0; y < shapeHeight; y++) {
      for (let x = 0; x < shapeWidth; x++) {
        if (shape[y][x] === 1) {
          const gridX = posX - centerX + x;
          const gridY = posY - centerY + y;

          if (
            gridX >= 0 &&
            gridX < BOARD_WIDTH &&
            gridY >= 0 &&
            gridY < BOARD_HEIGHT
          ) {
            grid[gridY][gridX] = "t";
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
    this.grid = this.gridWithCurrentTetrimino(tetrimino)
  }

  // cette fonction compte le nombre de 't' present sur le grid
  // elle va permettre de savoir si un move est possible
  numberOfTOnGrid(grid) {
    let number_of_t = 0;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      number_of_t += grid[y].filter((element) => element === "t").length;
    }
    return number_of_t
  }
}

export default Board;
