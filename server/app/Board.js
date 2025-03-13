import { BOARD_HEIGHT, BOARD_WIDTH } from "./const.js";

class Board {
  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
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

          if (
            gridX >= 0 &&
            gridX < BOARD_WIDTH &&
            gridY >= 0 &&
            gridY < BOARD_HEIGHT
          ) {
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
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (
        this.grid[y].filter((element) => element !== 0).length == BOARD_WIDTH
      ) {
        this.removeLineAndShiftDown(y);
      }
    }
  }

  removeLineAndShiftDown(lineIndex) {
    // Supprimer la ligne spécifiée
    for (let col = 0; col < BOARD_WIDTH; col++) {
      this.grid[lineIndex][col] = 0;
    }

    // Faire descendre toutes les lignes au-dessus de la ligne supprimée
    for (let row = lineIndex; row > 0; row--) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.grid[row][col] = this.grid[row - 1][col];
      }
    }

    // Remplir la première ligne avec des zéros
    for (let col = 0; col < BOARD_WIDTH; col++) {
      this.grid[0][col] = 0;
    }
    this.addLineOfTetriminos()
  }

  addLineOfTetriminos() {
    const penalites = Array(BOARD_WIDTH).fill('t');
    console.log(penalites)
    // Faire remonter toutes les lignes d'un cran
    for (let row = BOARD_HEIGHT - 1; row > 0; row--) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.grid[row][col] = this.grid[row - 1][col];
      }
    }

    // Ajouter la nouvelle ligne de tétriminos à la première ligne
    for (let col = 0; col < BOARD_WIDTH; col++) {
      this.grid[BOARD_HEIGHT - 1][col] = penalites[col];
    }
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
