import { configureStore } from '@reduxjs/toolkit';
import pseudoReducer from './pseudoSlice';

const store = configureStore({
  reducer: {
    pseudo: pseudoReducer,
  },
});

export default store;
