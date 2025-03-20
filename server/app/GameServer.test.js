// GameServer.test.js
import GameServer from './GameServer.js';
import Room from './Room.js';
import Player from './Player.js';

// Mock dependencies
jest.mock('./Room.js');
jest.mock('./Player.js');

describe('GameServer', () => {
  let gameServer;
  let mockSocket;
  let mockPlayer;
  let mockRoom;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock socket with emit method
    mockSocket = {
      emit: jest.fn(),
    };
    
    // Setup mock Player
    mockPlayer = {
      id: 'player1',
      pseudo: 'testPlayer',
      socket: mockSocket,
    };
    Player.mockImplementation(() => mockPlayer);
    
    // Setup mock Room
    mockRoom = {
      name: 'testRoom',
      admin_id: 'player1',
      players: [mockPlayer],
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      getState: jest.fn(),
      getNbPlayers: jest.fn(),
      newAdmin: jest.fn(),
      updateInfoRoom: jest.fn(),
    };
    Room.mockImplementation(() => mockRoom);
    
    // Create a new GameServer instance for each test
    gameServer = new GameServer();
  });

  test('constructor initializes with empty rooms, players, and visitors', () => {
    expect(gameServer.rooms).toEqual({});
    expect(gameServer.players).toEqual([]);
    expect(gameServer.visitors).toEqual([]);
  });

  describe('visitor management', () => {
    test('addVisitor adds a socket to visitors array', () => {
      gameServer.addVisitor(mockSocket);
      expect(gameServer.visitors).toContain(mockSocket);
    });

    test('removeVisitor removes a socket from visitors array', () => {
      // Add visitor first
      gameServer.addVisitor(mockSocket);
      expect(gameServer.visitors).toContain(mockSocket);
      
      // Remove visitor
      gameServer.removeVisitor(mockSocket);
      expect(gameServer.visitors).not.toContain(mockSocket);
    });
  });

  describe('player management', () => {
    test('createPlayer creates a new player and emits login_success', () => {
      const player = gameServer.createPlayer('testPlayer', mockSocket);
      
      // Check if player was created correctly
      expect(Player).toHaveBeenCalledWith('testPlayer', mockSocket);
      expect(gameServer.players).toContain(mockPlayer);
      
      // Check if login_success was emitted
      expect(mockSocket.emit).toHaveBeenCalledWith('login_success', {
        id: 'player1',
        pseudo: 'testPlayer',
      });
      
      // Check if the returned player is correct
      expect(player).toBe(mockPlayer);
    });

    test('deletePlayer removes a player by id', () => {
      // Add player first
      gameServer.createPlayer('testPlayer', mockSocket);
      expect(gameServer.players).toContain(mockPlayer);
      
      // Delete player
      gameServer.deletePlayer('player1');
      expect(gameServer.players).not.toContain(mockPlayer);
    });

    test('getPlayerById returns the correct player', () => {
      // Add player first
      gameServer.createPlayer('testPlayer', mockSocket);
      
      // Get player by id
      const player = gameServer.getPlayerById('player1');
      expect(player).toBe(mockPlayer);
    });
  });

  describe('room management', () => {
    test('createRoom creates a new room with the player as admin', () => {
      const room = gameServer.createRoom('testRoom', mockPlayer);
      
      // Check if Room was created correctly
      expect(Room).toHaveBeenCalledWith('testRoom', mockPlayer);
      expect(gameServer.rooms.testRoom).toBe(mockRoom);
      
      // Check if the returned room is correct
      expect(room).toBe(mockRoom);
    });

    test('removeRoom deletes a room and updates rooms list', () => {
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      expect(gameServer.rooms.testRoom).toBe(mockRoom);
      
      // Mock updateRoomsList
      gameServer.updateRoomsList = jest.fn();
      
      // Remove room
      gameServer.removeRoom(mockRoom);
      expect(gameServer.rooms.testRoom).toBeUndefined();
      expect(gameServer.updateRoomsList).toHaveBeenCalled();
    });

    test('getRoomByName returns the correct room', () => {
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Get room by name
      const room = gameServer.getRoomByName('testRoom');
      expect(room).toBe(mockRoom);
    });

    test('getAllRooms returns formatted rooms information', () => {
      // Setup getPlayerById to return mockPlayer
      gameServer.getPlayerById = jest.fn().mockReturnValue(mockPlayer);
      
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Get all rooms
      const rooms = gameServer.getAllRooms();
      expect(rooms).toEqual([{
        room_name: 'testRoom',
        nb_players: 1,
        admin_id: 'player1',
        admin_username: 'testPlayer',
        state: undefined, // mockRoom.getState() returns undefined by default
      }]);
    });

    test('updateRoomsList emits updated rooms to all visitors', () => {
      // Add visitors
      const mockVisitor1 = { emit: jest.fn() };
      const mockVisitor2 = { emit: jest.fn() };
      gameServer.addVisitor(mockVisitor1);
      gameServer.addVisitor(mockVisitor2);
      
      // Mock getAllRooms
      const mockRooms = [{ room_name: 'testRoom' }];
      gameServer.getAllRooms = jest.fn().mockReturnValue(mockRooms);
      
      // Update rooms list
      gameServer.updateRoomsList();
      
      // Check if updateRoomsList was emitted to all visitors
      expect(mockVisitor1.emit).toHaveBeenCalledWith('updateRoomsList', mockRooms);
      expect(mockVisitor2.emit).toHaveBeenCalledWith('updateRoomsList', mockRooms);
    });
  });

  describe('complex operations', () => {
    test('joinOrCreateRoom joins existing room if it exists', () => {
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Mock updateRoomsList
      gameServer.updateRoomsList = jest.fn();
      
      // Join room
      const newPlayer = { id: 'player2' };
      const room = gameServer.joinOrCreateRoom('testRoom', newPlayer);
      
      // Check if player was added to room
      expect(mockRoom.addPlayer).toHaveBeenCalledWith(newPlayer);
      expect(gameServer.updateRoomsList).toHaveBeenCalled();
      expect(room).toBe(mockRoom);
    });

    test('joinOrCreateRoom creates new room if it does not exist', () => {
      // Mock updateRoomsList
      gameServer.updateRoomsList = jest.fn();
      
      // Create and join room
      const newPlayer = { id: 'player2' };
      const room = gameServer.joinOrCreateRoom('newRoom', newPlayer);
      
      // Check if room was created
      expect(Room).toHaveBeenCalledWith('newRoom', newPlayer);
      expect(gameServer.updateRoomsList).toHaveBeenCalled();
      expect(room).toBe(mockRoom);
    });

    test('playerLeaveRoom removes room if last player leaves', () => {
      // Setup mocks
      mockRoom.getState.mockReturnValue('WAITING');
      mockRoom.getNbPlayers.mockReturnValue(0);
      
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Mock methods
      gameServer.removeRoom = jest.fn();
      
      // Player leaves room
      gameServer.playerLeaveRoom(mockPlayer, mockRoom);
      
      // Check if room was removed
      expect(mockRoom.removePlayer).toHaveBeenCalledWith(mockPlayer);
      expect(mockRoom.getNbPlayers).toHaveBeenCalled();
      expect(gameServer.removeRoom).toHaveBeenCalledWith(mockRoom);
    });

    test('playerLeaveRoom assigns new admin if admin leaves', () => {
      // Setup mocks
      mockRoom.getState.mockReturnValue('WAITING');
      mockRoom.getNbPlayers.mockReturnValue(1);
      
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Mock methods
      gameServer.updateRoomsList = jest.fn();
      
      // Player leaves room
      gameServer.playerLeaveRoom(mockPlayer, mockRoom);
      
      // Check if new admin was assigned
      expect(mockRoom.removePlayer).toHaveBeenCalledWith(mockPlayer);
      expect(mockRoom.newAdmin).toHaveBeenCalled();
      expect(gameServer.updateRoomsList).toHaveBeenCalled();
    });

    test('playerLeaveRoom does nothing for started games', () => {
      // Setup mocks
      mockRoom.getState.mockReturnValue('STARTED');
      
      // Create room first
      gameServer.createRoom('testRoom', mockPlayer);
      
      // Player leaves room
      gameServer.playerLeaveRoom(mockPlayer, mockRoom);
      
      // Check that nothing happened
      expect(mockRoom.removePlayer).not.toHaveBeenCalled();
    });
  });
});