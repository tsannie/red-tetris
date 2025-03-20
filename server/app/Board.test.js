// Board.test.js
import Board from './Board.js';
import Tetrimino from './Tetrimino.js';
import { BOARD_HEIGHT, BOARD_WIDTH } from './const.js';

// Mock des modules dépendants
jest.mock('./const.js', () => ({
  BOARD_HEIGHT: 20,
  BOARD_WIDTH: 10
}));

jest.mock('./Tetrimino.js');

describe('Board Class', () => {
  let board;
  let mockTetrimino;

  beforeEach(() => {
    // Réinitialisation des mocks
    jest.clearAllMocks();
    
    // Création d'une nouvelle instance de Board pour chaque test
    board = new Board();
    
    // Mock pour Tetrimino
    mockTetrimino = {
      getShape: jest.fn().mockReturnValue([
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ]),
      getColor: jest.fn().mockReturnValue('blue'),
      position: [5, 5]
    };
  });

  describe('constructor', () => {
    test('should initialize a board with correct dimensions', () => {
      expect(board.grid.length).toBe(BOARD_HEIGHT);
      board.grid.forEach(row => {
        expect(row.length).toBe(BOARD_WIDTH);
        expect(row.every(cell => cell === 0)).toBe(true);
      });
    });
  });

  describe('gridWithCurrentTetrimino', () => {
    test('should add tetrimino to the grid correctly', () => {
      const result = board.gridWithCurrentTetrimino(mockTetrimino);
      
      // Vérifions que le tetrimino est bien placé sur la grille
      // La position est [5, 5], donc le centre du tetrimino est à cette position
      expect(result[4][5]).toBe('blue'); // En haut du centre (T shape)
      expect(result[5][4]).toBe('blue'); // À gauche du centre (T shape)
      expect(result[5][5]).toBe('blue'); // Centre (T shape)
      expect(result[5][6]).toBe('blue'); // À droite du centre (T shape)
    });

    test('should not modify the original grid', () => {
      const originalGrid = board.grid.map(row => [...row]);
      board.gridWithCurrentTetrimino(mockTetrimino);
      
      // Vérifions que la grille originale n'a pas été modifiée
      expect(board.grid).toEqual(originalGrid);
    });

    test('should respect board boundaries', () => {
      // Plaçons le tetrimino au bord du plateau
      mockTetrimino.position = [0, 0];
      const result = board.gridWithCurrentTetrimino(mockTetrimino);
      
      // Certaines parties du tetrimino devraient être en dehors du plateau
      // et ne devraient pas être ajoutées à la grille
      const nonZeroCount = result.flat().filter(cell => cell !== 0).length;
      expect(nonZeroCount).toBeLessThan(4); // Moins de 4 blocs visibles
    });
  });

  describe('isOnBoard', () => {
    test('should return true when tetrimino is fully on board', () => {
      mockTetrimino.position = [5, 5]; // Centre du plateau
      const result = board.isOnBoard(mockTetrimino);
      expect(result).toBe(true);
    });

    test('should return false when tetrimino is partially off board', () => {
      // En supposant que cette position met le tetrimino partiellement hors du plateau
      mockTetrimino.position = [-1, 5];
      
      // Mock pour la nouvelle instance de Board créée dans isOnBoard
      Board.mockImplementation(() => ({
        gridWithCurrentTetrimino: jest.fn().mockReturnValue([
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          // ... grille avec seulement 3 blocs visibles
        ]),
        numberOfTOnGrid: jest.fn().mockReturnValue(3) // Moins de 4 blocs visibles
      }));
      
      const result = board.isOnBoard(mockTetrimino);
      expect(result).toBe(false);
    });
  });

  describe('isTetriminoInsert', () => {
    test('should return true when tetrimino can be inserted', () => {
      // Mock pour simuler l'ajout de 4 blocs
      const mockGridOriginal = board.grid;
      const mockGridWithTetrimino = [...mockGridOriginal];
      
      // Simulons que numberOfTOnGrid renvoie d'abord le nombre de blocs sur la grille,
      // puis avec 4 blocs supplémentaires
      board.numberOfTOnGrid = jest.fn()
        .mockReturnValueOnce(10) // Nombre initial de blocs
        .mockReturnValueOnce(14); // Après ajout du tetrimino (4 blocs de plus)
      
      board.gridWithCurrentTetrimino = jest.fn().mockReturnValue(mockGridWithTetrimino);
      
      const result = board.isTetriminoInsert(mockTetrimino);
      expect(result).toBe(true);
    });

    test('should return false when tetrimino cannot be inserted completely', () => {
      // Mock pour simuler l'ajout de moins de 4 blocs
      board.numberOfTOnGrid = jest.fn()
        .mockReturnValueOnce(10) // Nombre initial de blocs
        .mockReturnValueOnce(13); // Après ajout du tetrimino (3 blocs de plus seulement)
      
      const result = board.isTetriminoInsert(mockTetrimino);
      expect(result).toBe(false);
    });
  });

  describe('keepTetriminoOnBoard', () => {
    test('should add tetrimino to the board and return 0 penalties when no lines are cleared', () => {
      // Simulons l'ajout d'un tetrimino sans compléter de ligne
      board.gridWithCurrentTetrimino = jest.fn().mockReturnValue([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // ... et ainsi de suite, aucune ligne complète
      ]);
      
      const penalties = board.keepTetriminoOnBoard(mockTetrimino);
      expect(penalties).toBe(0);
    });

    test('should add tetrimino to the board and return penalties when lines are cleared', () => {
      // Créons une grille avec une ligne complète
      const mockGridWithFullLine = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
      mockGridWithFullLine[10] = Array(BOARD_WIDTH).fill('red'); // Ligne complète
      
      board.gridWithCurrentTetrimino = jest.fn().mockReturnValue(mockGridWithFullLine);
      board.removeLineAndShiftDown = jest.fn(); // Mock pour éviter les effets secondaires
      
      const penalties = board.keepTetriminoOnBoard(mockTetrimino);
      expect(penalties).toBe(1);
      expect(board.removeLineAndShiftDown).toHaveBeenCalledWith(10);
    });
  });

  describe('removeLineAndShiftDown', () => {
    test('should remove a line and shift all lines above it down', () => {
      // Préparons une grille avec quelques blocs
      board.grid[5] = Array(BOARD_WIDTH).fill('red');
      board.grid[4][5] = 'blue';
      board.grid[3][5] = 'green';
      
      board.removeLineAndShiftDown(5);
      
      // La ligne 5 devrait maintenant être vide
      expect(board.grid[5].every(cell => cell === 0)).toBe(true);
      
      // Les blocs au-dessus devraient avoir été décalés
      expect(board.grid[5][5]).toBe(0);
      expect(board.grid[4][5]).toBe('blue');
      expect(board.grid[3][5]).toBe('green');
    });
  });

  describe('addLineOfTetriminos', () => {
    test('should add a line at the bottom and shift all lines up', () => {
      // Ajoutons des blocs pour voir s'ils sont déplacés correctement
      board.grid[BOARD_HEIGHT - 2][5] = 'blue';
      board.grid[BOARD_HEIGHT - 3][5] = 'green';
      
      board.addLineOfTetriminos();
      
      // La dernière ligne devrait être remplie de 't'
      expect(board.grid[BOARD_HEIGHT - 1].every(cell => cell === 't')).toBe(true);
      
      // Les blocs devraient avoir été déplacés vers le haut
      expect(board.grid[BOARD_HEIGHT - 3][5]).toBe('blue');
      expect(board.grid[BOARD_HEIGHT - 4][5]).toBe('green');
    });
  });

  describe('numberOfTOnGrid', () => {
    test('should count non-zero elements correctly', () => {
      // Créons une grille avec un nombre connu de blocs
      const mockGrid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
      mockGrid[0][0] = 'red';
      mockGrid[0][1] = 'blue';
      mockGrid[1][0] = 'green';
      
      const count = board.numberOfTOnGrid(mockGrid);
      expect(count).toBe(3);
    });
  });

  describe('notFreePos', () => {
    test('should return positions of occupied cells', () => {
      // Créons une grille avec quelques cellules occupées
      const mockGrid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
      mockGrid[1][2] = 'red';
      mockGrid[3][4] = 'blue';
      
      const result = board.notFreePos(mockGrid);
      expect(result).toContain('12'); // Position y=1, x=2
      expect(result).toContain('34'); // Position y=3, x=4
      expect(result.length).toBe(2);
    });
  });

  describe('isOverwritingTetri', () => {
    test('should return true when tetrimino overlaps with existing blocks', () => {
      // Mettons un bloc sur la grille
      board.grid[5][5] = 'red';
      
      // Créons un nouveau board pour le mock
      const mockNewBoard = new Board();
      mockNewBoard.gridWithCurrentTetrimino = jest.fn().mockReturnValue([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // ... la plupart vides
        [0, 0, 0, 0, 0, 'blue', 0, 0, 0, 0], // Position qui chevauche avec le bloc existant
      ]);
      
      Board.mockImplementation(() => mockNewBoard);
      
      board.notFreePos = jest.fn()
        .mockReturnValueOnce(['55']) // Position occupée sur la grille existante
        .mockReturnValueOnce(['55']); // Position occupée par le tetrimino
        
      const result = board.isOverwritingTetri(mockTetrimino);
      expect(result).toBe(true);
    });

    test('should return false when tetrimino does not overlap with existing blocks', () => {
      // Mettons un bloc sur la grille
      board.grid[1][1] = 'red';
      
      // Le tetrimino est placé ailleurs
      board.notFreePos = jest.fn()
        .mockReturnValueOnce(['11']) // Position occupée sur la grille existante
        .mockReturnValueOnce(['55', '56', '65', '66']); // Positions occupées par le tetrimino
        
      const result = board.isOverwritingTetri(mockTetrimino);
      expect(result).toBe(false);
    });
  });
});
