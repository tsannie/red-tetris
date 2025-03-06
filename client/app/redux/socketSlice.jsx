import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socketConnected: false,
  socket: null,
  board: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state, { payload }) => {
      state.socketConnected = true;
      state.socket = payload;
    },
    connectionAttempt: (state) => {
      state = state;
    },
    disconnect: (state) => {
      state.socketConnected = false;
      state.socket = null;
    },

    emitMove: (state, { payload }) => {
      console.log('payload', payload);
      state.socket.emit('move', payload);
    },
    emitDrop: (state) => {
      state.socket.emit('drop');
    },
    emitRotate: (state) => {
      state.socket.emit('rotate');
    },
    emitStart: (state) => {
      state.socket.emit('start');
    },

    updateRoom: (state, { payload }) => {
      state.board = payload.board;
    },
  },
});

export const { connect, connectionAttempt, disconnect, emitMove, emitDrop, emitRotate, emitStart, updateRoom } =
  socketSlice.actions;

export const selectIsConnected = (state) => state.socket.socketConnected;

export default socketSlice.reducer;
