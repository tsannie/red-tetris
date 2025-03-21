import Game from './Game.js';
import Board from './Board.js';
import Tetrimino from './Tetrimino.js';
import { STATE, TETRIMINOS } from './const.js';

// Mock des dépendances
jest.mock('./Board.js');
jest.mock('./Tetrimino.js');

describe('Game', () => {
  let game;
  let mockPlayer1;
  let mockPlayer2;
  let mockBoard;
  let mockTetrimino;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mocks pour Tetrimino
    mockTetrimino = {
      getShapeWithColor: jest.fn().mockReturnValue([['#FF0000']]),
      shape: [['#FF0000']]
    };
    
    Tetrimino.mockImplementation(() => mockTetrimino);
    Tetrimino.clone = jest.fn().mockReturnValue(mockTetrimino);
    
    // Mock pour Board
    mockBoard = {
      grid: [[]],
      numberOfTOnGrid: jest.fn().mockReturnValue(0),
      gridWithCurrentTetrimino: jest.fn().mockReturnValue([[]])
    };
    
    Board.mockImplementation(() => mockBoard);
    
    // Mock pour les joueurs
    mockPlayer1 = {
      id: 'player1',
      pseudo: 'Player1',
      socket: { emit: jest.fn() },
      tetrimino: null,
      n_tetriminos: 0,
      board: null,
      state: STATE.WAITING,
      resetAttrib: jest.fn(),
      move: jest.fn(),
      gridWithCurrentTetriminoWithShadow: jest.fn().mockReturnValue([[]])
    };
    
    mockPlayer2 = {
      id: 'player2',
      pseudo: 'Player2',
      socket: { emit: jest.fn() },
      tetrimino: null,
      n_tetriminos: 0,
      board: null,
      state: STATE.WAITING,
      resetAttrib: jest.fn(),
      move: jest.fn(),
      gridWithCurrentTetriminoWithShadow: jest.fn().mockReturnValue([[]])
    };
    
    // Création de l'instance de Game
    game = new Game();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('devrait créer une instance de Game avec les valeurs par défaut', () => {
    expect(game.typeOfGame).toBe('SOLO');
    expect(game.players).toEqual([]);
    expect(game.state).toBe(STATE.WAITING);
    expect(game.interval).toBeNull();
    expect(game.tetriminos_history).toEqual([]);
    expect(game.gameInterval).toBe(3000);
    expect(game.refreshInterval).toBe(0);
    expect(game.lastWinnerId).toBeNull();
  });

  test('devrait réinitialiser les attributs du jeu', () => {
    // Setup
    game.state = STATE.STARTED;
    game.interval = setInterval(() => {}, 1000);
    game.tetriminos_history = [mockTetrimino];
    game.gameInterval = 2000;
    game.refreshInterval = 5;
    game.players = [mockPlayer1, mockPlayer2];
    
    // Action
    game.resetAttrib();
    
    // Assertions
    expect(game.state).toBe(STATE.WAITING);
    expect(game.interval).toBeNull();
    expect(game.tetriminos_history).toEqual([]);
    expect(game.gameInterval).toBe(3000);
    expect(game.refreshInterval).toBe(0);
    expect(mockPlayer1.resetAttrib).toHaveBeenCalled();
    expect(mockPlayer2.resetAttrib).toHaveBeenCalled();
  });

  test('devrait générer une clé aléatoire de tetrimino', () => {
    // Simuler Math.random pour un test déterministe
    const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0);
    
    const key = game.getRandomKey();
    
    expect(key).toBe(Object.keys(TETRIMINOS)[0]);
    mockMathRandom.mockRestore();
  });

  test('devrait mettre à jour l\'historique des tetriminos', () => {
    const player = { 
      n_tetriminos: 3,
      board: mockBoard
    };
    game.tetriminos_history = [mockTetrimino];
    
    game.updateTetriminosHistory(player);
    
    expect(game.tetriminos_history.length).toBe(5); // 1 existant + 4 nouveaux
    expect(Tetrimino).toHaveBeenCalledTimes(4);
  });

  test('devrait démarrer le jeu en mode solo', () => {
    game.start([mockPlayer1]);
    
    expect(game.typeOfGame).toBe('SOLO');
    expect(game.players).toEqual([mockPlayer1]);
    expect(mockPlayer1.game).toBe(game);
    expect(Board).toHaveBeenCalled();
    expect(mockPlayer1.socket.emit).toHaveBeenCalledWith('gameStarted');
    expect(game.interval).not.toBeNull();
  });

  test('devrait démarrer le jeu en mode multi', () => {
    game.start([mockPlayer1, mockPlayer2]);
    
    expect(game.typeOfGame).toBe('MULTI');
    expect(game.players).toContain(mockPlayer1);
    expect(game.players).toContain(mockPlayer2);
    expect(mockPlayer1.socket.emit).toHaveBeenCalledWith('gameStarted');
    expect(mockPlayer2.socket.emit).toHaveBeenCalledWith('gameStarted');
  });

  test('devrait mettre à jour le jeu et gérer les tetriminos des joueurs', () => {
    // Setup
    game.players = [mockPlayer1];
    mockPlayer1.state = STATE.STARTED;
    mockPlayer1.board = mockBoard;  // Important: définir le board avant d'appeler update
    mockPlayer1.n_tetriminos = 0;
    
    // Remplir l'historique des tetriminos pour éviter un accès à un index invalide
    game.tetriminos_history = [mockTetrimino, mockTetrimino];
    
    // Action
    game.update();
    
    // Vérifier que les tetriminos sont gérés et que l'état du jeu est mis à jour
    expect(mockPlayer1.socket.emit).toHaveBeenCalled();
    expect(game.refreshInterval).toBe(1);
  });

  test('devrait terminer le jeu pour un joueur', () => {
    // Setup
    game.players = [mockPlayer1];
    mockPlayer1.state = STATE.STARTED;
    mockPlayer1.board = mockBoard;  // Définir le board
    game.typeOfGame = 'SOLO';
    
    // Action
    game.gameFinished(mockPlayer1.id);
    
    // Vérifier l'état du jeu après la fin
    expect(mockPlayer1.state).toBe(STATE.FINISHED);
    expect(mockPlayer1.socket.emit).toHaveBeenCalledWith('finished', expect.any(Object));
    expect(mockPlayer1.socket.emit).toHaveBeenCalledWith('gameFinished', expect.any(Object));
    expect(game.state).toBe(STATE.WAITING);
  });

  test('devrait supprimer un joueur du jeu', () => {
    // Setup
    game.players = [mockPlayer1, mockPlayer2];
    
    // Action
    game.removePlayer(mockPlayer1);
    
    // Vérifier que le joueur est supprimé
    expect(game.players).not.toContain(mockPlayer1);
    expect(game.players).toContain(mockPlayer2);
  });

  test('devrait démarrer le jeu avec un nouvel intervalle', () => {
    // Setup
    game.interval = setInterval(() => {}, 3000);
    
    // Action
    game.startWithNewInterval(2000);
    
    // Vérifier que l'intervalle est mis à jour
    expect(game.gameInterval).toBe(2000);
  });

  test('ne devrait pas mettre à jour l\'intervalle si trop court', () => {
    // Setup
    game.interval = setInterval(() => {}, 3000);
    const originalInterval = game.interval;
    
    // Action
    game.startWithNewInterval(400); // En dessous de la limite de 500
    
    // Vérifier que l'intervalle n'est pas mis à jour
    expect(game.gameInterval).toBe(3000);
  });

  test('devrait ajouter des pénalités aux autres joueurs', () => {
    // Setup
    mockPlayer1.penalities = jest.fn();
    mockPlayer2.penalities = jest.fn();
    game.players = [mockPlayer1, mockPlayer2];
    
    // Action
    game.addPenalities(mockPlayer1.id);
    
    // Vérifier que les pénalités sont ajoutées au bon joueur
    expect(mockPlayer1.penalities).not.toHaveBeenCalled();
    expect(mockPlayer2.penalities).toHaveBeenCalled();
  });

  test('devrait nettoyer et supprimer le jeu', () => {
    // Setup
    game.interval = setInterval(() => {}, 1000);
    game.players = [mockPlayer1];
    game.state = STATE.STARTED;
    game.tetriminos_history = [mockTetrimino];
    
    // Action
    game.delete();
    
    // Vérifier que le jeu est correctement nettoyé
    expect(game.players).toEqual([]);
    expect(game.state).toBe(STATE.WAITING);
    expect(game.tetriminos_history).toEqual([]);
  });
});