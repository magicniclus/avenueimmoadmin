import { configureStore } from "@reduxjs/toolkit";
import setDrawerOpen from "./drawerSlice";
// import adminSlice from "./adminSlice";
// import userReducer from "./createUserSlice";

export const store = configureStore({
  reducer: {
    drawer: setDrawerOpen,
    // createUser: userReducer,
    // admin: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
