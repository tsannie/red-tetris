import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0,
  linesCleared: 0,
  gameOver: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    incrementScore(state, action) {
      state.score += action.payload;
    },
    incrementLinesCleared(state, action) {
      state.linesCleared += action.payload;
    },
    setGameOver(state, action) {
      state.gameOver = action.payload;
    },
  },
});

export const { incrementScore, incrementLinesCleared, setGameOver } = gameSlice.actions;

export default gameSlice.reducer;
