import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  socketConnected: false,
  socket: null,
  roomError: false,
  pseudoError: false,
  board: [],
  next: [],
  current: [],
  otherPlayers: [],
  deadPlayer: [],
};

export const connectionAttempt = createAction('socket/connectionAttempt');
export const emitJoinOrCreateRoom = createAction('socket/emitJoinOrCreateRoom');
export const emitExitRoom = createAction('socket/emitExitRoom');
export const emitMove = createAction('socket/emitMove');
export const emitDrop = createAction('socket/emitDrop');
export const emitRotate = createAction('socket/emitRotate');
export const emitStart = createAction('socket/emitStart');
export const emitGetRooms = createAction('socket/emitGetRooms');

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state, { payload }) => {
      state.socketConnected = true;
      state.socket = payload;
    },
    disconnect: (state) => {
      state.socketConnected = false;
      state.socket = null;
    },
    updateRoom: (state, { payload }) => {
      state.board = payload.board;
      state.next = payload.nextTetriminos[0] = payload.nextTetriminos[0].map((row) =>
        row.map((cell) => (cell === 0 ? 's' : cell))
      );
      state.current = payload.currentTetrimino.map((row) => row.map((cell) => (cell === 0 ? 's' : cell)));

      state.otherPlayers = payload.otherPlayers;
    },
    reset: (state) => {
      state.board = [];
      state.next = [];
      state.current = [];
      state.otherPlayers = [];
      state.deadPlayer = [];
    },
    setRoomError: (state, { payload }) => {
      state.roomError = payload;
    },
    setPseudoError: (state, { payload }) => {
      state.pseudoError = payload;
    },
    setDeadPlayer: (state, { payload }) => {
      const playerId = payload.idPlayer;
      state.deadPlayer.push(playerId);
    },
  },
});

export const { connect, disconnect, updateRoom, reset, setRoomError, setPseudoError, setDeadPlayer } =
  socketSlice.actions;

export const selectIsConnected = (state) => state.socket.socketConnected;

export default socketSlice.reducer;
