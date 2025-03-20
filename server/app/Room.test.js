import { STATE } from './const.js';
import Room from './Room';
import Game from './Game.js';

// Mock dependencies
jest.mock('./Game.js');

describe('Room', () => {
  let mockPlayer;
  let mockPlayer2;
  let room;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up mock player
    mockPlayer = {
      id: 'player-1',
      pseudo: 'Player One',
      socket: {
        emit: jest.fn()
      },
      state: STATE.WAITING,
      gridWithCurrentTetriminoWithShadow: jest.fn().mockReturnValue([]),
      tetrimino: {
        getShapeWithColor: jest.fn().mockReturnValue([])
      },
      game: {
        retrievePlayerBoard: jest.fn().mockReturnValue([]),
        nextTetriminosWithColor: jest.fn().mockReturnValue([])
      }
    };
    
    mockPlayer2 = {
      id: 'player-2',
      pseudo: 'Player Two',
      socket: {
        emit: jest.fn()
      },
      state: STATE.WAITING
    };

    // Set up mock Game implementation
    Game.mockImplementation(() => {
      return {
        state: STATE.WAITING,
        movePlayer: jest.fn(),
        start: jest.fn(),
        retrievePlayerBoard: jest.fn(),
        nextTetriminosWithColor: jest.fn()
      };
    });

    // Create room instance
    room = new Room('Test Room', mockPlayer);
  });

  describe('constructor', () => {
    test('should initialize with correct properties', () => {
      expect(room.name).toBe('Test Room');
      expect(room.players).toEqual([mockPlayer]);
      expect(room.admin_id).toBe('player-1');
      expect(room.game).toBeDefined();
    });
  });

  describe('getNbPlayers', () => {
    test('should return correct number of players', () => {
      expect(room.getNbPlayers()).toBe(1);
      
      room.addPlayer(mockPlayer2);
      expect(room.getNbPlayers()).toBe(2);
    });
  });

  describe('getState', () => {
    test('should return game state', () => {
      expect(room.getState()).toBe(STATE.WAITING);
      
      room.game.state = STATE.STARTED;
      expect(room.getState()).toBe(STATE.STARTED);
    });
  });

  describe('newAdmin', () => {
    test('should set first player as admin', () => {
      room.addPlayer(mockPlayer2);
      room.admin_id = 'player-2';
      
      room.newAdmin();
      
      expect(room.admin_id).toBe('player-1');
      expect(mockPlayer.socket.emit).toHaveBeenCalled();
      expect(mockPlayer2.socket.emit).toHaveBeenCalled();
    });
    
    test('should do nothing if no players', () => {
      room.players = [];
      const originalAdminId = room.admin_id;
      
      room.newAdmin();
      
      expect(room.admin_id).toBe(originalAdminId);
    });
  });

  describe('movePlayer', () => {
    test('should call game.movePlayer with correct params', () => {
      const direction = 'left';
      
      room.movePlayer(mockPlayer, direction);
      
      expect(room.game.movePlayer).toHaveBeenCalledWith(mockPlayer, direction);
    });
  });

  describe('startGame', () => {
    test('should call game.start with players', () => {
      room.startGame();
      
      expect(room.game.start).toHaveBeenCalledWith(room.players);
    });
  });

  describe('addPlayer', () => {
    test('should add player to room', () => {
      room.addPlayer(mockPlayer2);
      
      expect(room.players).toContain(mockPlayer2);
      expect(room.getNbPlayers()).toBe(2);
    });
  });

  describe('removePlayer', () => {
    test('should remove player from room', () => {
      room.addPlayer(mockPlayer2);
      expect(room.getNbPlayers()).toBe(2);
      
      room.removePlayer(mockPlayer2);
      
      expect(room.players).not.toContain(mockPlayer2);
      expect(room.getNbPlayers()).toBe(1);
    });
    
    test('should not affect other players', () => {
      room.addPlayer(mockPlayer2);
      
      room.removePlayer({id: 'non-existent'});
      
      expect(room.getNbPlayers()).toBe(2);
    });
  });

  describe('updatePlayerState', () => {
    test('should emit update event if player state is STARTED', () => {
      mockPlayer.state = STATE.STARTED;
      
      room.updatePlayerState(mockPlayer);
      
      expect(mockPlayer.socket.emit).toHaveBeenCalledWith('update', expect.objectContaining({
        board: expect.any(Array),
        otherPlayers: expect.any(Array),
        currentTetrimino: expect.any(Array),
        nextTetriminos: expect.any(Array)
      }));
    });
    
    test('should not emit update event if player state is not STARTED', () => {
      mockPlayer.state = STATE.WAITING;
      
      room.updatePlayerState(mockPlayer);
      
      expect(mockPlayer.socket.emit).not.toHaveBeenCalledWith('update', expect.anything());
    });
  });

  describe('updateInfoRoom', () => {
    test('should emit updateInfoRoom event to all players', () => {
      room.addPlayer(mockPlayer2);
      
      room.updateInfoRoom();
      
      // Check first player received correct data
      expect(mockPlayer.socket.emit).toHaveBeenCalledWith('updateInfoRoom', {
        players: [
          { id: 'player-1', username: 'Player One' },
          { id: 'player-2', username: 'Player Two' }
        ],
        admin_id: 'player-1',
        user_id: 'player-1'
      });
      
      // Check second player received correct data
      expect(mockPlayer2.socket.emit).toHaveBeenCalledWith('updateInfoRoom', {
        players: [
          { id: 'player-1', username: 'Player One' },
          { id: 'player-2', username: 'Player Two' }
        ],
        admin_id: 'player-1',
        user_id: 'player-2'
      });
    });
  });
});
