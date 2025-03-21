import GameServer from './GameServer.js';
import Room from './Room.js';
import Player from './Player.js';
import { STATE } from './const.js';

// Mock des dépendances
jest.mock('./Room.js');
jest.mock('./Player.js');

describe('GameServer', () => {
  let gameServer;
  let mockSocket;
  let mockPlayer;
  let mockRoom;

  beforeEach(() => {
    // Réinitialisation des mocks
    jest.clearAllMocks();
    
    // Création des mocks
    mockSocket = {
      emit: jest.fn()
    };
    
    mockPlayer = {
      id: 'player1',
      pseudo: 'TestPlayer',
      socket: mockSocket
    };
    
    mockRoom = {
      name: 'TestRoom',
      players: [mockPlayer],
      admin_id: 'player1',
      getState: jest.fn().mockReturnValue(STATE.WAITING),
      getNbPlayers: jest.fn().mockReturnValue(1),
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      newAdmin: jest.fn(),
      updateInfoRoom: jest.fn(),
      deleteGame: jest.fn()
    };
    
    // Configurer les mocks des constructeurs
    Player.mockImplementation((pseudo, socket) => ({
      id: 'player1',
      pseudo,
      socket
    }));
    
    Room.mockImplementation((name, playerAdmin) => mockRoom);
    
    // Initialisation du GameServer
    gameServer = new GameServer();
  });

  test('devrait créer une instance de GameServer', () => {
    expect(gameServer).toBeDefined();
    expect(gameServer.rooms).toEqual({});
    expect(gameServer.players).toEqual([]);
    expect(gameServer.visitors).toEqual([]);
  });

  test('devrait ajouter un visiteur', () => {
    gameServer.addVisitor(mockSocket);
    expect(gameServer.visitors).toContain(mockSocket);
  });

  test('devrait supprimer un visiteur', () => {
    gameServer.addVisitor(mockSocket);
    gameServer.removeVisitor(mockSocket);
    expect(gameServer.visitors).not.toContain(mockSocket);
  });

  test('devrait créer un joueur', () => {
    const player = gameServer.createPlayer('TestPlayer', mockSocket);
    expect(gameServer.players).toHaveLength(1);
    expect(mockSocket.emit).toHaveBeenCalledWith('login_success', {
      id: 'player1',
      pseudo: 'TestPlayer'
    });
  });

  test('devrait créer une salle et récupérer un joueur par son ID', () => {
    // Ajouter d'abord le joueur à la liste des joueurs
    gameServer.players.push(mockPlayer);
    const room = gameServer.createRoom('TestRoom', mockPlayer);
    expect(gameServer.rooms['TestRoom']).toBeDefined();
    
    // Tester la méthode getPlayerById
    const player = gameServer.getPlayerById('player1');
    expect(player).toBe(mockPlayer);
    expect(player.pseudo).toBe('TestPlayer');
  });

  test('devrait récupérer une salle par son nom', () => {
    gameServer.createRoom('TestRoom', mockPlayer);
    const room = gameServer.getRoomByName('TestRoom');
    expect(room).toBeDefined();
    expect(room.name).toBe('TestRoom');
  });

  test('devrait supprimer un joueur', () => {
    gameServer.createPlayer('TestPlayer', mockSocket);
    gameServer.deletePlayer('player1');
    expect(gameServer.players).toHaveLength(0);
  });

  test('devrait vérifier si une salle est pleine', () => {
    gameServer.createRoom('TestRoom', mockPlayer);
    mockRoom.getNbPlayers.mockReturnValue(5);
    expect(gameServer.roomIsFull('TestRoom')).toBe(true);
    
    mockRoom.getNbPlayers.mockReturnValue(4);
    expect(gameServer.roomIsFull('TestRoom')).toBe(false);
  });

  test('devrait vérifier si une partie est commencée', () => {
    gameServer.createRoom('TestRoom', mockPlayer);
    mockRoom.getState.mockReturnValue(STATE.STARTED);
    expect(gameServer.roomIsStarted('TestRoom')).toBe(true);
    
    mockRoom.getState.mockReturnValue(STATE.WAITING);
    expect(gameServer.roomIsStarted('TestRoom')).toBe(false);
  });

  test('devrait faire quitter une salle à un joueur', () => {
    // Ajouter le joueur à la liste des joueurs
    gameServer.players.push(mockPlayer);
    
    // Créer et configurer la salle
    gameServer.createRoom('TestRoom', mockPlayer);
    
    // Mock de getPlayerById pour qu'il retourne le joueur
    gameServer.getPlayerById = jest.fn().mockReturnValue(mockPlayer);
    
    // Mock de updateRoomsList pour éviter d'appeler la vraie méthode
    gameServer.updateRoomsList = jest.fn();
    
    // Appeler la méthode à tester
    gameServer.playerLeaveRoom(mockPlayer, mockRoom);
    
    // Vérifications
    expect(mockRoom.removePlayer).toHaveBeenCalledWith(mockPlayer);
  });

  test('devrait supprimer une salle quand le dernier joueur la quitte', () => {
    // Ajouter le joueur à la liste des joueurs
    gameServer.players.push(mockPlayer);
    
    // Créer et configurer la salle
    gameServer.createRoom('TestRoom', mockPlayer);
    
    // Mock de getPlayerById pour qu'il retourne le joueur
    gameServer.getPlayerById = jest.fn().mockReturnValue(mockPlayer);
    
    // Mock de updateRoomsList pour éviter d'appeler la vraie méthode
    gameServer.updateRoomsList = jest.fn();
    
    // Configurer mockRoom pour qu'il retourne 0 joueurs
    mockRoom.getNbPlayers.mockReturnValue(0);
    
    // Appeler la méthode à tester
    gameServer.playerLeaveRoom(mockPlayer, mockRoom);
    
    // Vérifier que la salle a été supprimée
    expect(gameServer.rooms['TestRoom']).toBeUndefined();
  });

  test('devrait obtenir la liste de toutes les salles', () => {
    // S'assurer que le joueur existe dans la liste des joueurs avant de créer la salle
    gameServer.players.push(mockPlayer);
    gameServer.createRoom('TestRoom', mockPlayer);
    
    // Mock de getPlayerById pour qu'il retourne le joueur
    gameServer.getPlayerById = jest.fn().mockReturnValue(mockPlayer);
    
    const rooms = gameServer.getAllRooms();
    expect(rooms).toHaveLength(1);
    expect(rooms[0].room_name).toBe('TestRoom');
    expect(rooms[0].admin_username).toBe('TestPlayer');
  });
});