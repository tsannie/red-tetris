import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  room_name: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setRoomName: (state, action) => {
      // TODO check useless ?
      state.id = action.payload;
    },
  },
});

export const { setUsername, setRoomName } = userSlice.actions;

export const selectUsername = (state) => state.user.username;
export const selectRoomName = (state) => state.user.room_name;

export default userSlice.reducer;
