import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  id: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    logout: (state) => {
      state.username = '';
      state.id = null;
    },
    login: (state) => {
      state = state;
    },
  },
});

export const { setUsername, setId, logout, login } = userSlice.actions;

export const selectUsername = (state) => state.user.username;
export const selectId = (state) => state.user.id;

export default userSlice.reducer;
