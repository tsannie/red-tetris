import { configureStore } from '@reduxjs/toolkit';
import pseudoReducer from './pseudoSlice';
import socketReducer from './socketSlice';
import socketMiddleware from './socketMiddleware';

const store = configureStore({
  reducer: {
    pseudo: pseudoReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});

export default store;
