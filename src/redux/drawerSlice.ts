import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition de l'état initial avec une structure plus appropriée
const initialState = {
  drawerOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setDrawerOpen } = userSlice.actions;

export default userSlice.reducer;
