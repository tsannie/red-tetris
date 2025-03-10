import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  socketConnected: false,
  socket: null,
  board: [],
};

const connectionAttempt = createAction('socket/connectionAttempt');
const emitJoinOrCreateRoom = createAction('socket/emitJoinOrCreateRoom');
const emitMove = createAction('socket/emitMove');
const emitDrop = createAction('socket/emitDrop');
const emitRotate = createAction('socket/emitRotate');
const emitStart = createAction('socket/emitStart');

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
    },
  },
});

export { connectionAttempt, emitJoinOrCreateRoom, emitMove, emitDrop, emitRotate, emitStart };

export const { connect, disconnect, updateRoom } = socketSlice.actions;

export const selectIsConnected = (state) => state.socket.socketConnected;

export default socketSlice.reducer;
