// Room.test.js
import Room from './Room.js';
import { STATE } from './const.js';
import Game from './Game.js';

// Mock dependencies
jest.mock('./Game.js');
jest.mock('./const.js', () => ({
  STATE: {
    WAITING: 'WAITING',
    STARTED: 'STARTED',
    FINISHED: 'FINISHED'
  }
}));

describe('Room', () => {
  let room;
  let mockAdminPlayer;
  let mockGame;
  let mockPlayer;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock game instance
    mockGame = {
      state: STATE.WAITING,
      start: jest.fn(players => {
        players.forEach(player => player.resetAttrib());
      }),
      delete: jest.fn(),
      removePlayer: jest.fn(),
      movePlayer: jest.fn(),
      retrievePlayerBoard: jest.fn().mockReturnValue([]),
      nextTetriminosWithColor: jest.fn().mockReturnValue([])
    };
    
    // Mock Game constructor
    Game.mockImplementation(() => mockGame);
    
    // Create mock players
    mockAdminPlayer = {
      id: 'admin-id',
      pseudo: 'Admin',
      socket: {
        emit: jest.fn()
      },
      state: STATE.WAITING,
      gridWithCurrentTetriminoWithShadow: jest.fn().mockReturnValue([]),
      tetrimino: {
        getShapeWithColor: jest.fn().mockReturnValue([])
      },
      resetAttrib: jest.fn()
    };
    
    mockPlayer = {
      id: 'player-id',
      pseudo: 'Player',
      socket: {
        emit: jest.fn()
      },
      state: STATE.WAITING,
      gridWithCurrentTetriminoWithShadow: jest.fn().mockReturnValue([]),
      tetrimino: {
        getShapeWithColor: jest.fn().mockReturnValue([])
      },
      resetAttrib: jest.fn()
    };
    
    // Create room instance
    room = new Room('test-room', mockAdminPlayer);
  });

  test('constructor initializes room correctly', () => {
    expect(room.name).toBe('test-room');
    expect(room.players).toEqual([mockAdminPlayer]);
    expect(room.admin_id).toBe('admin-id');
    expect(Game).toHaveBeenCalled();
  });

  test('getNbPlayers returns correct number of players', () => {
    expect(room.getNbPlayers()).toBe(1);
    
    room.addPlayer(mockPlayer);
    expect(room.getNbPlayers()).toBe(2);
  });

  test('getState returns game state', () => {
    mockGame.state = STATE.WAITING;
    expect(room.getState()).toBe(STATE.WAITING);
    
    mockGame.state = STATE.STARTED;
    expect(room.getState()).toBe(STATE.STARTED);
  });

  test('addPlayer adds a player to the room', () => {
    room.addPlayer(mockPlayer);
    expect(room.players).toContain(mockPlayer);
    expect(room.players.length).toBe(2);
  });

  test('removePlayer removes a player from the room', () => {
    // Add player first
    room.addPlayer(mockPlayer);
    expect(room.players.length).toBe(2);
    
    // Remove player
    room.removePlayer(mockPlayer);
    
    // Check player was removed
    expect(room.players).not.toContain(mockPlayer);
    expect(room.players.length).toBe(1);
    expect(mockGame.removePlayer).toHaveBeenCalledWith(mockPlayer);
  });

  test('newAdmin assigns a new admin if current admin leaves', () => {
    // Add another player
    room.addPlayer(mockPlayer);
    
    // Remove admin
    room.removePlayer(mockAdminPlayer);
    
    // Assign new admin
    room.newAdmin();
    
    // Player should be new admin
    expect(room.admin_id).toBe('player-id');
  });

  test('newAdmin does nothing if room is empty', () => {
    // Remove all players
    room.removePlayer(mockAdminPlayer);
    
    // Try to assign new admin
    room.newAdmin();
    
    // Admin should still be null
    expect(room.admin_id).toEqual("admin-id");
  });

  test('startGame calls game.start with players and resets player attributes', () => {
    room.startGame();
    expect(mockGame.start).toHaveBeenCalledWith(room.players);
    expect(mockAdminPlayer.resetAttrib).toHaveBeenCalled();
  });

  test('movePlayer calls game.movePlayer', () => {
    const direction = [0, 1];
    room.movePlayer(mockAdminPlayer, direction);
    expect(mockGame.movePlayer).toHaveBeenCalledWith(mockAdminPlayer, direction);
  });

  test('updatePlayerState emits update event with correct data when player state is STARTED', () => {
    // Set player state to STARTED
    mockAdminPlayer.state = STATE.STARTED;
    mockAdminPlayer.game = mockGame;
    
    // Update player state
    room.updatePlayerState(mockAdminPlayer);
    
    // Check if socket.emit was called with correct params
    expect(mockAdminPlayer.socket.emit).toHaveBeenCalledWith('update', {
      board: mockAdminPlayer.gridWithCurrentTetriminoWithShadow(),
      otherPlayers: mockGame.retrievePlayerBoard(mockAdminPlayer),
      currentTetrimino: mockAdminPlayer.tetrimino.getShapeWithColor(),
      nextTetriminos: mockGame.nextTetriminosWithColor(mockAdminPlayer)
    });
  });

  test('updatePlayerState does nothing when player state is not STARTED', () => {
    // Set player state to WAITING
    mockAdminPlayer.state = STATE.WAITING;
    
    // Update player state
    room.updatePlayerState(mockAdminPlayer);
    
    // Check that socket.emit was not called
    expect(mockAdminPlayer.socket.emit).not.toHaveBeenCalledWith('update', expect.anything());
  });

  test('updateInfoRoom emits updateInfoRoom event to all players', () => {
    // Add another player
    room.addPlayer(mockPlayer);
    
    // Set game's lastWinnerId
    mockGame.lastWinnerId = 'player-id';
    
    // Update room info
    room.updateInfoRoom();
    
    // Expected players data
    const expectedPlayers = [
      { id: 'admin-id', username: 'Admin' },
      { id: 'player-id', username: 'Player' }
    ];
    
    // Check if socket.emit was called with correct params for admin
    expect(mockAdminPlayer.socket.emit).toHaveBeenCalledWith('updateInfoRoom', {
      players: expectedPlayers,
      admin_id: 'admin-id',
      user_id: 'admin-id',
      last_winner_id: 'player-id'
    });
    
    // Check if socket.emit was called with correct params for player
    expect(mockPlayer.socket.emit).toHaveBeenCalledWith('updateInfoRoom', {
      players: expectedPlayers,
      admin_id: 'admin-id',
      user_id: 'player-id',
      last_winner_id: 'player-id'
    });
  });

  test('deleteGame cleans up room resources', () => {
    // Add another player
    room.addPlayer(mockPlayer);
    
    // Delete game
    room.deleteGame();
    
    // Check if resources were cleaned up
    expect(mockGame.delete).toHaveBeenCalled();
    expect(room.game).toBeNull();
    expect(room.players).toEqual([]);
    expect(room.admin_id).toBeNull();
    expect(room.name).toBeNull();
  });
});