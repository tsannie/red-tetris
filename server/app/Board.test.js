import Board from './Board';
import { BOARD_HEIGHT, BOARD_WIDTH, TETRIMINOS } from './const';

// Mock de la classe Tetrimino
jest.mock('./Tetrimino', () => {
  return jest.fn().mockImplementation((type) => ({
    getShape: jest.fn().mockReturnValue([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]),
    getColor: jest.fn().mockReturnValue('purple'),
    position: [5, 5],
    rotation: 0
  }));
});

// Import du mock
import Tetrimino from './Tetrimino';

describe('Board Class', () => {
  let board;
  let tetrimino;

  beforeEach(() => {
    board = new Board();
    tetrimino = new Tetrimino('T');
  });

  test('should initialize a grid with correct dimensions', () => {
    expect(board.grid.length).toBe(BOARD_HEIGHT);
    expect(board.grid[0].length).toBe(BOARD_WIDTH);
  });

  test('should initialize an empty grid', () => {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        expect(board.grid[y][x]).toBe(0);
      }
    }
  });

  describe('isOnBoard method', () => {
    test('should return true when tetrimino is on board', () => {
      expect(board.isOnBoard(tetrimino)).toBe(true);
    });

    test('should return false when tetrimino is not on board', () => {
      // Placer le tetrimino en dehors du plateau
      tetrimino.position = [-10, -10];
      expect(board.isOnBoard(tetrimino)).toBe(false);
    });
  });

  describe('gridWithCurrentTetrimino method', () => {
    test('should return a grid with the tetrimino placed on it', () => {
      const gridWithTetrimino = board.gridWithCurrentTetrimino(tetrimino);
      
      // Vérifier que le tetrimino est effectivement placé
      let tetriminoBlockCount = 0;
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (gridWithTetrimino[y][x] === 'purple') {
            tetriminoBlockCount++;
          }
        }
      }
      expect(tetriminoBlockCount).toBe(4); // T tetrimino a 4 blocs
    });

    test('should not modify the original grid', () => {
      const originalGrid = JSON.parse(JSON.stringify(board.grid));
      board.gridWithCurrentTetrimino(tetrimino);
      expect(board.grid).toEqual(originalGrid);
    });
  });

  describe('isTetriminoInsert method', () => {
    test('should return true when tetrimino can be inserted', () => {
      expect(board.isTetriminoInsert(tetrimino)).toBe(true);
    });

    test('should return false when tetrimino cannot be inserted', () => {
      // Créer un cas où le tetrimino ne peut pas être inséré
      // Par exemple, en remplissant la grille
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board.grid[y][x] = 'red';
        }
      }
      expect(board.isTetriminoInsert(tetrimino)).toBe(false);
    });
  });

  describe('keepTetriminoOnBoard method', () => {
    test('should add tetrimino to grid', () => {
      board.keepTetriminoOnBoard(tetrimino);
      
      // Vérifier que le tetrimino est maintenant sur la grille
      let tetriminoBlockCount = 0;
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (board.grid[y][x] === 'purple') {
            tetriminoBlockCount++;
          }
        }
      }
      expect(tetriminoBlockCount).toBe(4);
    });

    test('should return penalties when lines are cleared', () => {
      // Remplir une ligne presque complète
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (x !== 5) {
          board.grid[10][x] = 'red';
        }
      }
      
      // Placer le tetrimino pour compléter la ligne
      tetrimino.position = [5, 10];
      tetrimino.getShape = jest.fn().mockReturnValue([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ]);
      
      const penalties = board.keepTetriminoOnBoard(tetrimino);
      expect(penalties).toBe(1);
    });
  });

  describe('removeLineAndShiftDown method', () => {
    test('should remove a complete line and shift down', () => {
      // Remplir une ligne
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board.grid[10][x] = 'red';
      }
      
      // Ajouter quelques blocs au-dessus
      board.grid[9][5] = 'blue';
      board.grid[8][5] = 'green';
      
      board.removeLineAndShiftDown(10);
      
      // Vérifier que la ligne a été supprimée
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (x === 5) {
          expect(board.grid[10][x]).toBe('blue');
        } else {
          expect(board.grid[10][x]).toBe(0);
        }
      }
      
      // Vérifier que les blocs au-dessus ont été décalés
      expect(board.grid[9][5]).toBe('green');
      expect(board.grid[8][5]).toBe(0);
    });
  });

  describe('addLineOfTetriminos method', () => {
    test('should add a line of tetriminos at the bottom', () => {
      // Ajouter quelques blocs
      board.grid[BOARD_HEIGHT-2][5] = 'blue';
      
      board.addLineOfTetriminos();
      
      // Vérifier que la ligne du bas est remplie de 't'
      for (let x = 0; x < BOARD_WIDTH; x++) {
        expect(board.grid[BOARD_HEIGHT-1][x]).toBe('t');
      }
      
      // Vérifier que les blocs existants ont été décalés vers le haut
      expect(board.grid[BOARD_HEIGHT-3][5]).toBe('blue');
    });
  });

  describe('numberOfTOnGrid method', () => {
    test('should return the correct number of non-zero elements', () => {
      // Grille vide au départ
      expect(board.numberOfTOnGrid(board.grid)).toBe(0);
      
      // Ajouter quelques blocs
      board.grid[5][5] = 'red';
      board.grid[6][6] = 'blue';
      board.grid[7][7] = 'green';
      
      expect(board.numberOfTOnGrid(board.grid)).toBe(3);
    });
  });

  describe('notFreePos method', () => {
    test('should return array of occupied positions', () => {
      // Grille vide au départ
      expect(board.notFreePos(board.grid)).toEqual([]);
      
      // Ajouter quelques blocs
      board.grid[5][5] = 'red';
      board.grid[6][6] = 'blue';
      
      const occupiedPositions = board.notFreePos(board.grid);
      expect(occupiedPositions).toContain('55');
      expect(occupiedPositions).toContain('66');
      expect(occupiedPositions.length).toBe(2);
    });
  });

  describe('isOverwritingTetri method', () => {
    test('should return true when tetrimino overlaps with existing blocks', () => {
      // Ajouter un bloc à la position où le tetrimino sera placé
      board.grid[5][5] = 'red';
      
      expect(board.isOverwritingTetri(tetrimino)).toBe(true);
    });

    test('should return false when tetrimino does not overlap with existing blocks', () => {
      // Placer le tetrimino ailleurs
      tetrimino.position = [2, 2];
      
      expect(board.isOverwritingTetri(tetrimino)).toBe(false);
    });
  });
});
