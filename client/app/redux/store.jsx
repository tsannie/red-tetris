import { configureStore } from '@reduxjs/toolkit';
import pseudoReducer from './userSlice';
import socketReducer from './socketSlice';
import middleware from './middleware';

const store = configureStore({
  reducer: {
    user: pseudoReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middleware),
});

export default store;
