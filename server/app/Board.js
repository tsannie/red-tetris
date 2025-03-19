import { BOARD_HEIGHT, BOARD_WIDTH } from "./const.js";
import Tetrimino from "./Tetrimino.js";

class Board {
  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
  }

  isOnBoard(tetrimino) {
    if (this.numberOfTOnGrid(new Board().gridWithCurrentTetrimino(tetrimino)) != 4) return false
    return true
  }


  gridWithCurrentTetrimino(tetrimino, grid, dev) {
    if (grid === undefined) grid = this.grid
    grid = grid.map((row) => row.slice());
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
            grid[gridY][gridX] = tetrimino.getColor();
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

  isTetriminoInsert(tetrimino) {
    var numberOfBlock = 4
    if (this.numberOfTOnGrid(this.gridWithCurrentTetrimino(tetrimino)) === this.numberOfTOnGrid(this.grid) + numberOfBlock) {
      return true;
    }
    return false;
  }

  // appeler cette fonction lorsque un tetrimino est arrive a la collision
  // et le rajouter au grid
  // renvoie un entier = nombre de ligne au autres joueurs
  keepTetriminoOnBoard(tetrimino) {
    this.grid = this.gridWithCurrentTetrimino(tetrimino);
    let penalities = 0
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (
        this.grid[y].filter((element) => element !== 0 && element !== 't').length == BOARD_WIDTH
      ) {
        this.removeLineAndShiftDown(y);
        penalities += 1
      }
    }
    return penalities
  }

  // appeler cette fonction pour chaque joueur
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
  }

  addLineOfTetriminos() {
    const penalites = Array(BOARD_WIDTH).fill('t');
    // Faire remonter toutes les lignes d'un cran
    for (let row = 0; row < BOARD_HEIGHT - 1; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.grid[row][col] = this.grid[row + 1][col];
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

  notFreePos(grid) {
    var occupatedPos = new Array()
    for (let y=0;y<BOARD_HEIGHT;y++){
      for (let x=0;x<BOARD_WIDTH;x++){
        if (grid[y][x] !== 0){
          occupatedPos.push(String(y) + String(x))
        }
      }
    }
    return occupatedPos
  }

  // Cette fonction verifie que le tetrimino n'ecrase pas un tetrimino existant
  isOverwritingTetri(tetrimino){
    const occupatedPos = this.notFreePos(this.grid)
    const posTetrimino = this.notFreePos(new Board().gridWithCurrentTetrimino(tetrimino))
    var isOverwriting = false
    posTetrimino.forEach((element) => {
      if (occupatedPos.includes(element)){
        isOverwriting = true
      }
    })
    return isOverwriting;
  }
}

export default Board;
