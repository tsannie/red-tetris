// index.test.js
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import GameServer from './app/GameServer.js';
import { direction_vector } from './app/utils.js';

// Mock dependencies to prevent actual server creation
jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
  };
  return jest.fn(() => mockApp);
});

jest.mock('http', () => {
  const mockServer = {
    listen: jest.fn((port, callback) => {
      if (callback) callback();
      return mockServer;
    }),
  };
  return {
    createServer: jest.fn(() => mockServer),
  };
});

jest.mock('socket.io', () => {
  const mockIo = {
    on: jest.fn(),
  };
  return {
    Server: jest.fn(() => mockIo),
  };
});

jest.mock('./app/GameServer.js');
jest.mock('./app/utils.js', () => ({
  direction_vector: {
    left: [-1, 0],
    right: [1, 0],
    down: [0, 1],
  },
}));

describe('Socket.io Server (Index.js)', () => {
  let mockSocket;
  let mockIo;
  let mockGameServer;
  let mockRoom;
  let mockPlayer;
  
  // Save original process.exit
  const originalProcessExit = process.exit;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Prevent server from actually exiting during tests
    process.exit = jest.fn();
    
    // Setup mock socket
    mockSocket = {
      id: 'socket-id-123',
      emit: jest.fn(),
      on: jest.fn(),
    };

    // Setup mock room
    mockRoom = {
      admin_id: 'player-id-123',
      updateInfoRoom: jest.fn(),
      startGame: jest.fn(),
      updatePlayerState: jest.fn(),
    };

    // Setup mock player
    mockPlayer = {
      id: 'player-id-123',
      move: jest.fn(),
      rotate: jest.fn(),
      drop: jest.fn(),
    };

    // Setup mock gameServer
    mockGameServer = {
      addVisitor: jest.fn(),
      removeVisitor: jest.fn(),
      createPlayer: jest.fn().mockReturnValue(mockPlayer),
      joinOrCreateRoom: jest.fn().mockReturnValue(mockRoom),
      playerLeaveRoom: jest.fn(),
      getAllRooms: jest.fn().mockReturnValue([{ name: 'testRoom' }]),
      updateRoomsList: jest.fn(),
    };

    // Mock GameServer constructor
    GameServer.mockImplementation(() => mockGameServer);
    
    // Setup mockIo to call the callback with our mockSocket
    mockIo = Server();
    mockIo.on.mockImplementation((event, callback) => {
      if (event === 'connect') {
        callback(mockSocket);
      }
    });
  });
  
  afterEach(() => {
    // Restore original process.exit
    process.exit = originalProcessExit;
  });

  test('Server initializes correctly', () => {
    // Directly import index.js (this will run the file)
    jest.isolateModules(() => {
      // This will trigger the code in index.js to run
      require('./index.js');
    });
    
    // Check that express, http.createServer, and Server were called
    expect(express).toHaveBeenCalled();
    expect(http.createServer).toHaveBeenCalled();
    expect(Server).toHaveBeenCalled();
    
    // Get the mock server instance
    const mockServer = http.createServer();
    
    // Check that the server is listening on port 4000
    expect(mockServer.listen).toHaveBeenCalledWith(4000, expect.any(Function));
    
    // Check that a GameServer instance was created
    expect(GameServer).toHaveBeenCalled();
    
    // Check that socket.io is listening for connections
    expect(mockIo.on).toHaveBeenCalledWith('connect', expect.any(Function));
  });

  test('Socket event handlers are registered when a connection is established', () => {
    // Directly import index.js (this will run the file)
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // Check that the socket event handlers are registered
    const expectedEvents = [
      'joinOrCreateRoom',
      'exitRoom',
      'startGame',
      'move',
      'rotate',
      'drop',
      'getRoomsList',
      'disconnect'
    ];
    
    expectedEvents.forEach(event => {
      expect(mockSocket.on).toHaveBeenCalledWith(event, expect.any(Function));
    });
    
    // Check that addVisitor was called
    expect(mockGameServer.addVisitor).toHaveBeenCalledWith(mockSocket);
  });

  // Next, let's test each handler by finding it and invoking it directly
  
  test('joinOrCreateRoom event handler creates player and joins room', () => {
    // Import index.js
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // Find the joinOrCreateRoom handler
    const joinOrCreateRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'joinOrCreateRoom'
    )[1];
    
    // Call the handler
    joinOrCreateRoomHandler({ username: 'testPlayer', room_name: 'testRoom' });
    
    // Check expected behavior
    expect(mockGameServer.createPlayer).toHaveBeenCalledWith('testPlayer', mockSocket);
    expect(mockGameServer.joinOrCreateRoom).toHaveBeenCalledWith('testRoom', mockPlayer);
    expect(mockRoom.updateInfoRoom).toHaveBeenCalled();
  });
  
  test('exitRoom event handler removes player from room', () => {
    // Import index.js
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // First join a room to set up the test
    const joinOrCreateRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'joinOrCreateRoom'
    )[1];
    joinOrCreateRoomHandler({ username: 'testPlayer', room_name: 'testRoom' });
    
    // Find the exitRoom handler
    const exitRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'exitRoom'
    )[1];
    
    // Call the handler
    exitRoomHandler();
    
    // Check expected behavior
    expect(mockGameServer.playerLeaveRoom).toHaveBeenCalledWith(mockPlayer, mockRoom);
  });
  
  test('startGame event handler starts the game if user is admin', () => {
    // Import index.js
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // First join a room to set up the test
    const joinOrCreateRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'joinOrCreateRoom'
    )[1];
    joinOrCreateRoomHandler({ username: 'testPlayer', room_name: 'testRoom' });
    
    // Find the startGame handler
    const startGameHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'startGame'
    )[1];
    
    // Call the handler
    startGameHandler();
    
    // Check expected behavior
    expect(mockRoom.startGame).toHaveBeenCalled();
    expect(mockGameServer.updateRoomsList).toHaveBeenCalled();
  });
  
  test('move event handler moves player if possible', () => {
    // Setup successful move
    mockPlayer.move.mockReturnValue(true);
    
    // Import index.js
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // First join a room to set up the test
    const joinOrCreateRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'joinOrCreateRoom'
    )[1];
    joinOrCreateRoomHandler({ username: 'testPlayer', room_name: 'testRoom' });
    
    // Find the move handler
    const moveHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'move'
    )[1];
    
    // Call the handler
    moveHandler('left');
    
    // Check expected behavior
    expect(mockPlayer.move).toHaveBeenCalledWith(direction_vector.left);
    expect(mockRoom.updatePlayerState).toHaveBeenCalledWith(mockPlayer);
  });
  
  test('disconnect event handler removes player from room and visitor list', () => {
    // Import index.js
    jest.isolateModules(() => {
      require('./index.js');
    });
    
    // First join a room to set up the test
    const joinOrCreateRoomHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'joinOrCreateRoom'
    )[1];
    joinOrCreateRoomHandler({ username: 'testPlayer', room_name: 'testRoom' });
    
    // Find the disconnect handler
    const disconnectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];
    
    // Call the handler
    disconnectHandler();
    
    // Check expected behavior
    expect(mockGameServer.playerLeaveRoom).toHaveBeenCalledWith(mockPlayer, mockRoom);
    expect(mockGameServer.removeVisitor).toHaveBeenCalledWith(mockSocket);
  });
});