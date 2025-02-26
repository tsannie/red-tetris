import { createSlice } from '@reduxjs/toolkit';

export const pseudoSlice = createSlice({
  name: 'pseudo',
  initialState: {
    value: '',
  },
  reducers: {
    setPseudo: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPseudo } = pseudoSlice.actions;

export const selectPseudo = (state) => state.pseudo.value;

export default pseudoSlice.reducer;
