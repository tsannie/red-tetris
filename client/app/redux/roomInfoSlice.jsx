import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [],
  room_name: null,
  admin_id: null,
  username: null,
};

export const roomInfoSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setRoomName: (state, action) => {
      state.room_name = action.payload;
    },
    setAdminId: (state, action) => {
      state.admin_id = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
  },
});

export const { setPlayers, setRoomName, setAdminId, setUsername, setUserId } = roomInfoSlice.actions;

export const selectUsername = (state) => state.room.username;
export const selectRoomName = (state) => state.room.room_name;
export const selectPlayers = (state) => state.room.players;
export const selectAdminId = (state) => state.room.admin_id;
export const selectUserId = (state) => state.room.user_id;

export default roomInfoSlice.reducer;
