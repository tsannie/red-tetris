import { configureStore } from '@reduxjs/toolkit';
import socketReducer from './socketSlice';
import roomInfoReducer from './roomInfoSlice';
import middleware from './middleware';

const store = configureStore({
  reducer: {
    room: roomInfoReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middleware),
});

export default store;
