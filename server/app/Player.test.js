// Player.test.js
import Player from './Player.js';
import { STATE } from './const.js';
import Tetrimino from './Tetrimino.js';
import { generateUniqueUserId } from './utils.js';

// Mock dependencies
jest.mock('./utils.js', () => ({
  generateUniqueUserId: jest.fn().mockReturnValue('test-user-id')
}));

jest.mock('./Tetrimino.js');
Tetrimino.clone = jest.fn();

describe('Player', () => {
  let player;
  let mockSocket;
  let mockBoard;
  let mockTetrimino;
  let mockGame;

  beforeEach(() => {
    // Create a mock socket
    mockSocket = {
      emit: jest.fn()
    };

    // Create a mock board
    mockBoard = {
      gridWithCurrentTetrimino: jest.fn(),
      numberOfTOnGrid: jest.fn(),
      isTetriminoInsert: jest.fn(),
      isOverwritingTetri: jest.fn(),
      keepTetriminoOnBoard: jest.fn(),
      addLineOfTetriminos: jest.fn()
    };

    // Create a mock tetrimino
    mockTetrimino = {
      move: jest.fn(),
      rotate: jest.fn(),
      getColor: jest.fn().mockReturnValue('red')
    };

    // Mock the clone method to return a new mock tetrimino
    Tetrimino.clone.mockImplementation(() => ({
      ...mockTetrimino,
      color: mockTetrimino.color
    }));

    // Create a mock game
    mockGame = {
      gameFinished: jest.fn(),
      manageTetriminosPlayers: jest.fn(),
      addPenalities: jest.fn()
    };

    // Create a new player instance
    player = new Player('testPlayer', mockSocket);
    player.board = mockBoard;
    player.tetrimino = mockTetrimino;
    player.game = mockGame;
  });

  test('constructor initializes player correctly', () => {
    expect(player.id).toBe('test-user-id');
    expect(player.pseudo).toBe('testPlayer');
    expect(player.socket).toBe(mockSocket);
    expect(player.n_tetriminos).toBe(0);
    expect(player.state).toBe(STATE.WAITING);
  });

  test('move returns false when state is not STARTED', () => {
    player.state = STATE.FINISHED;
    const result = player.move([0, 1]);
    expect(result).toBe(false);
    expect(mockTetrimino.move).not.toHaveBeenCalled();
  });

  test('move returns false when tetrimino is null', () => {
    player.state = STATE.STARTED;
    player.tetrimino = null;
    const result = player.move([0, 1]);
    expect(result).toBe(false);
  });

  test('move moves tetrimino when possible', () => {
    player.state = STATE.STARTED;
    mockBoard.numberOfTOnGrid.mockReturnValue(4); // Same number before and after
    mockBoard.isTetriminoInsert.mockReturnValue(true);
    
    const result = player.move([1, 0]);
    
    expect(result).toBe(true);
    expect(mockTetrimino.move).toHaveBeenCalledWith([1, 0]);
  });

  test('rotate returns false when state is not STARTED', () => {
    player.state = STATE.FINISHED;
    const result = player.rotate();
    expect(result).toBe(false);
    expect(mockTetrimino.rotate).not.toHaveBeenCalled();
  });

  test('rotate rotates tetrimino when possible', () => {
    player.state = STATE.STARTED;
    mockBoard.numberOfTOnGrid.mockReturnValueOnce(4).mockReturnValueOnce(4); // Same number before and after
    mockBoard.isOverwritingTetri.mockReturnValue(false);
    
    const result = player.rotate();
    
    expect(result).toBe(true);
    expect(mockTetrimino.rotate).toHaveBeenCalled();
  });

  test('penalities adds a line of tetriminos', () => {
    player.penalities();
    expect(mockBoard.addLineOfTetriminos).toHaveBeenCalled();
  });

  test('gridWithCurrentTetriminoWithShadow returns combined grid', () => {
    // Setup mocks
    mockBoard.gridWithCurrentTetrimino.mockReturnValueOnce('shadowGrid').mockReturnValueOnce('finalGrid');
    player.canMoveShadow = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
    
    const result = player.gridWithCurrentTetriminoWithShadow();
    
    expect(mockTetrimino.getColor).toHaveBeenCalled();
    expect(mockTetrimino.move).toHaveBeenCalled();
    expect(result).toBe('finalGrid');
  });
});