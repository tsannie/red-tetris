import { jest } from '@jest/globals';
import { Server } from 'socket.io';
import GameServer from './app/GameServer.js';
import { direction_vector, isValidName } from './app/utils.js';

// Mocks pour les dépendances
jest.mock('express', () => {
  return jest.fn(() => ({
    use: jest.fn(),
  }));
});

jest.mock('http', () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn((port, callback) => {
      callback();
      return { close: jest.fn() };
    })
  }))
}));

jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({
    on: jest.fn((event, callback) => {
      if (event === 'connect') {
        // Stocker le callback pour pouvoir le tester plus tard
        mockSocketCallback = callback;
      }
    })
  }))
}));

jest.mock('./app/GameServer.js');
jest.mock('./app/utils.js', () => ({
  direction_vector: {
    left: [-1, 0],
    right: [1, 0],
    down: [0, 1]
  },
  isValidName: jest.fn()
}));

// Variable globale pour stocker le callback passé à io.on('connect')
let mockSocketCallback;

describe('Server initialization', () => {
  let server;
  let originalConsoleLog;
  
  beforeEach(() => {
    // Sauvegarder console.log original
    originalConsoleLog = console.log;
    console.log = jest.fn();
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Mock de GameServer
    GameServer.mockImplementation(() => ({
      addVisitor: jest.fn(),
      removeVisitor: jest.fn(),
      createPlayer: jest.fn().mockReturnValue({ id: 'player1', socket: {}, move: jest.fn(), rotate: jest.fn(), drop: jest.fn() }),
      joinOrCreateRoom: jest.fn().mockReturnValue({ 
        updateInfoRoom: jest.fn(),
        admin_id: 'player1',
        startGame: jest.fn(),
        updatePlayerState: jest.fn()
      }),
      playerLeaveRoom: jest.fn(),
      roomIsStarted: jest.fn(),
      roomIsFull: jest.fn(),
      updateRoomsList: jest.fn(),
      getAllRooms: jest.fn().mockReturnValue([])
    }));
    
    // Mock de direction_vector et isValidName
    isValidName.mockImplementation(() => true);
    
    // Importer index.js (contenant les gestionnaires socket.io)
    server = require('./index.js');
  });
  
  afterEach(() => {
    // Restaurer console.log
    console.log = originalConsoleLog;
  });
  
  test('devrait initialiser le serveur sur le port 4000', () => {
    expect(console.log).toHaveBeenCalledWith('Socket.io server running on port 4000');
    expect(Server).toHaveBeenCalled();
  });
  
  test('devrait configurer les gestionnaires d\'événements socket.io', () => {
    // Vérifier que io.on('connect') a été appelé
    expect(mockSocketCallback).toBeDefined();
    
    // Créer un mock pour le socket
    const mockSocket = {
      id: 'socket1',
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        // Stocker les callbacks pour pouvoir les tester plus tard
        socketEventCallbacks[event] = callback;
      })
    };
    
    // Objet pour stocker les callbacks des événements socket
    const socketEventCallbacks = {};
    
    // Simuler une connexion
    mockSocketCallback(mockSocket);
    
    
    // Vérifier que socket.on a été appelé pour chaque événement attendu
    expect(mockSocket.on).toHaveBeenCalledWith('joinOrCreateRoom', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('exitRoom', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('startGame', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('move', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('rotate', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('drop', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('getRoomsList', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('roomWaiting', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });
});

describe('Socket event handlers', () => {
  let mockSocket;
  let mockGameServer;
  let mockRoom;
  let mockPlayer;
  let socketEventCallbacks = {};
  
  beforeEach(() => {
    // Créer un mock pour le socket
    mockSocket = {
      id: 'socket1',
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        // Stocker les callbacks pour pouvoir les tester plus tard
        socketEventCallbacks[event] = callback;
      })
    };
    
    // Créer un mock pour le joueur
    mockPlayer = { 
      id: 'player1', 
      socket: mockSocket,
      move: jest.fn().mockReturnValue(true),
      rotate: jest.fn().mockReturnValue(true),
      drop: jest.fn()
    };
    
    // Créer un mock pour la salle
    mockRoom = {
      updateInfoRoom: jest.fn(),
      admin_id: 'player1',
      startGame: jest.fn(),
      updatePlayerState: jest.fn()
    };
    
    // Créer un mock pour le GameServer
    mockGameServer = {
      addVisitor: jest.fn(),
      removeVisitor: jest.fn(),
      createPlayer: jest.fn().mockReturnValue(mockPlayer),
      joinOrCreateRoom: jest.fn().mockReturnValue(mockRoom),
      playerLeaveRoom: jest.fn(),
      roomIsStarted: jest.fn().mockReturnValue(false),
      roomIsFull: jest.fn().mockReturnValue(false),
      updateRoomsList: jest.fn(),
      getAllRooms: jest.fn().mockReturnValue([])
    };
    
    // Remplacer l'implémentation de GameServer
    GameServer.mockImplementation(() => mockGameServer);
    
    // Mock de isValidName
    isValidName.mockImplementation((name) => name !== 'invalid');
    
    // Importer index.js (contenant les gestionnaires socket.io)
    require('./index.js');
    
    // Simuler une connexion et récupérer les callbacks
    mockSocketCallback(mockSocket);
  });

  test('devrait renvoyer une erreur si le nom d\'utilisateur est invalide', () => {
    const data = { username: 'invalid', room_name: 'testRoom' };
    
    // Appeler le callback de joinOrCreateRoom
    socketEventCallbacks.joinOrCreateRoom(data);
    
    // Vérifier que l'erreur a été émise
    expect(mockSocket.emit).toHaveBeenCalledWith('pseudoError', { message: 'Invalid username' });
    expect(mockGameServer.createPlayer).not.toHaveBeenCalled();
  });
  

});