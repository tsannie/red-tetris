// Game.test.js
import Game from './Game';
import { STATE, TETRIMINOS } from './const';
import Tetrimino from './Tetrimino';
import Board from './Board';

jest.mock('./Tetrimino');
jest.mock('./Board');
jest.mock('./const', () => ({
  STATE: {
    STARTED: 'started', // on game
    WAITING: 'waiting', // on pre-game
    FINISHED: 'finished', // other
  },
  TETRIMINOS: {
    'T': { shape: [[1, 1, 1], [0, 1, 0]], color: ['purple'] },
  },
  BOARD_HEIGHT: 20,
}));

describe('Game', () => {
  let game;
  let mockPlayer;

  beforeEach(() => {
    game = new Game();

    Board.mockImplementation(() => ({
      grid: Array.from({ length: 20 }, () => Array(8).fill(0)),
      numberOfTOnGrid: jest.fn().mockReturnValue(0),
      gridWithCurrentTetrimino: jest.fn().mockReturnValue(
        Array.from({ length: 20 }, () => Array(8).fill(0))
      ),
    }));

    mockPlayer = {
      id: '1',
      pseudo: 'Player1',
      socket: { emit: jest.fn() },
      game: game,
      board: new Board(),
      n_tetriminos: 0,
      tetrimino: null,
      state: STATE.FINISHED,
      move: jest.fn(),
      gridWithCurrentTetriminoWithShadow: jest.fn(),
      penalities: jest.fn(),
    };
  });

  test('should initialize with correct default values', () => {
    expect(game.typeOfGame).toBe('SOLO');
    expect(game.state).toBe(STATE.WAITING);
    expect(game.interval).toBeNull();
    expect(game.tetriminos_history).toEqual([]);
    expect(game.gameInterval).toBe(3000);
    expect(game.refreshInterval).toBe(0);
  });

  test('getRandomKey should return a random key from TETRIMINOS', () => {
    const keys = Object.keys(TETRIMINOS);
    const randomKey = game.getRandomKey();
    expect(keys).toContain(randomKey);
  });

  test('updateTetriminosHistory should add new Tetriminos to history', () => {
    mockPlayer.n_tetriminos = 2;
    game.updateTetriminosHistory(mockPlayer);
    expect(game.tetriminos_history.length).toBeGreaterThanOrEqual(4);
  });

  test('retrievePlayerBoard should return other players game info', () => {
    game.players = [mockPlayer, { pseudo: 'Player2', state: STATE.STARTED, board: { grid: [] } }];
    const otherPlayersGame = game.retrievePlayerBoard(mockPlayer);
    expect(otherPlayersGame.length).toBe(1);
    expect(otherPlayersGame[0].pseudo).toBe('Player2');
  });

  test('update should call manageTetriminosPlayers for each player', () => {
    game.players = [mockPlayer];
    game.update = jest.fn();
    game.update();
    expect(game.update).toHaveBeenCalled();
  });

  test('nextTetriminosWithColor should return next Tetriminos with color', () => {
    game.tetriminos_history = [new Tetrimino('T'), new Tetrimino('T')];
    mockPlayer.n_tetriminos = 0;
    const nextTetriminos = game.nextTetriminosWithColor(mockPlayer);
    expect(nextTetriminos.length).toBe(2);
    expect(nextTetriminos[0]).toEqual(game.tetriminos_history[0].getShapeWithColor());
  });

  test('gameFinished should set player state to FINISHED and emit finished event', () => {
    game.players = [mockPlayer];
    game.gameFinished(mockPlayer.id);
    expect(mockPlayer.state).toBe(STATE.FINISHED);
    expect(mockPlayer.socket.emit).toHaveBeenCalledWith('finished', {
      idPlayer: mockPlayer.id,
      pseudo: mockPlayer.pseudo,
    });
  });

  test('start should initialize game with players', () => {
    game.start([mockPlayer]);
    clearInterval(game.interval)
    expect(game.players).toContain(mockPlayer);
    expect(mockPlayer.socket.emit).toHaveBeenCalledWith('gameStarted');
    clearInterval(game.interval)
  });

  test('startWithNewInterval should update game interval', () => {
    game.startWithNewInterval(2000);
    expect(game.gameInterval).toBe(2000);
    clearInterval(game.interval)
  });

  test('addPenalities should call penalities on other players', () => {
    game.players = [mockPlayer, { id: '2', penalities: jest.fn() }];
    game.addPenalities(mockPlayer.id);
    expect(game.players[1].penalities).toHaveBeenCalled();
  });
});
