import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  socket: null,
  board: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state, { payload }) => {
      console.log('Connection established with the server');
      state.isConnected = true;
      state.socket = payload;
    },
    connectionAttempt: (state) => {
      state = state;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.socket = null;
    },

    emitMove: (state, { payload }) => {
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

export default socketSlice.reducer;
