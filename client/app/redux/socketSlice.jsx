import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  socketConnected: false,
  socket: null,
  board: [],
  next: [],
  current: [],
  otherPlayers: [],
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
      //console.log('payload', payload);
      state.board = payload.board;
      // replace 0 in the payload.nextTetriminos[0] by s
      state.next = payload.nextTetriminos[0] = payload.nextTetriminos[0].map((row) =>
        row.map((cell) => (cell === 0 ? 's' : cell))
      );
      state.current = payload.currentTetrimino.map((row) => row.map((cell) => (cell === 0 ? 's' : cell)));

      state.otherPlayers = payload.otherPlayers;
    },
  },
});

export const { connect, disconnect, updateRoom } = socketSlice.actions;

export const selectIsConnected = (state) => state.socket.socketConnected;

export default socketSlice.reducer;
