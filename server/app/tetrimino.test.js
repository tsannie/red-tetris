// Tetrimino.test.js
import Tetrimino from './Tetrimino';
import { BOARD_WIDTH, TETRIMINOS } from './const.js';

// Mock du module const.js puisque nous ne l'avons pas
jest.mock('./const.js', () => ({
  BOARD_WIDTH: 10,
  TETRIMINOS: {
    'I': {
      shape: [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
      ],
      color: ['cyan']
    },
    'T': {
      shape: [
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
      ],
      color: ['purple']
    }
  }
}));

describe('Tetrimino Class', () => {
  describe('constructor', () => {
    test('should initialize a tetrimino with correct properties', () => {
      const tetrimino = new Tetrimino('I');
      
      expect(tetrimino.shape).toEqual(TETRIMINOS['I'].shape);
      expect(tetrimino.color).toBe('cyan');
      expect(tetrimino.position).toEqual([BOARD_WIDTH / 2, 1]);
      expect(tetrimino.rotation).toBe(0);
    });
  });
  
  describe('static clone method', () => {
    test('should create a deep copy of a tetrimino', () => {
      const original = new Tetrimino('T');
      const cloned = Tetrimino.clone(original);
      
      // Vérification que c'est une copie indépendante
      expect(cloned).not.toBe(original);
      
      // Vérification que les propriétés sont identiques
      expect(cloned.shape).toEqual(original.shape);
      expect(cloned.color).toBe(original.color);
      expect(cloned.position).toEqual(original.position);
      expect(cloned.rotation).toBe(original.rotation);
      
      // Vérification que c'est bien une instance de Tetrimino
      expect(cloned instanceof Tetrimino).toBe(true);
      
      // Vérifions que c'est une copie profonde en modifiant l'original
      original.position[0] = 99;
      expect(cloned.position[0]).not.toBe(99);
    });
  });
  
  describe('rotate method', () => {
    test('should increment rotation and wrap around to 0 when reaching shape length', () => {
      const tetrimino = new Tetrimino('I');
      const shapeLength = tetrimino.shape.length;
      
      // Première rotation
      tetrimino.rotate();
      expect(tetrimino.rotation).toBe(1);
      
      // Continuons à tourner
      tetrimino.rotate();
      expect(tetrimino.rotation).toBe(2);
      
      tetrimino.rotate();
      expect(tetrimino.rotation).toBe(3);
      
      // Le suivant devrait revenir à 0
      tetrimino.rotate();
      expect(tetrimino.rotation).toBe(0);
    });
  });
  
  describe('move method', () => {
    test('should update position based on vector', () => {
      const tetrimino = new Tetrimino('T');
      
      // Position initiale
      expect(tetrimino.position).toEqual([BOARD_WIDTH / 2, 1]);
      
      // Déplacement à droite
      tetrimino.move([1, 0]);
      expect(tetrimino.position).toEqual([BOARD_WIDTH / 2 + 1, 1]);
      
      // Déplacement en bas
      tetrimino.move([0, 2]);
      expect(tetrimino.position).toEqual([BOARD_WIDTH / 2 + 1, 3]);
      
      // Déplacement à gauche et en bas
      tetrimino.move([-3, 1]);
      expect(tetrimino.position).toEqual([BOARD_WIDTH / 2 - 2, 4]);
    });
  });
  
  describe('getShape method', () => {
    test('should return current shape based on rotation', () => {
      const tetrimino = new Tetrimino('I');
      
      // Vérifions que getShape retourne la forme correspondant à la rotation actuelle
      expect(tetrimino.getShape()).toBe(tetrimino.shape[0]);
      
      tetrimino.rotate();
      expect(tetrimino.getShape()).toBe(tetrimino.shape[1]);
      
      tetrimino.rotate();
      expect(tetrimino.getShape()).toBe(tetrimino.shape[2]);
    });
  });
  
  describe('getColor method', () => {
    test('should return the color of the tetrimino', () => {
      const tetrimino = new Tetrimino('T');
      expect(tetrimino.getColor()).toBe('purple');
      
      const tetriminoI = new Tetrimino('I');
      expect(tetriminoI.getColor()).toBe('cyan');
    });
  });
});
