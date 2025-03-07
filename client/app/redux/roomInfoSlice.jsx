import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAdmin: false,
  room_name: '',
};

export const roomInfoSlice = createSlice({
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

export const { setUsername, setRoomName } = roomInfoSlice.actions;

export const selectUsername = (state) => state.room.username;
export const selectRoomName = (state) => state.room.room_name;

export default roomInfoSlice.reducer;
