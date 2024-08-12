import { configureStore } from "@reduxjs/toolkit";

import studentGradesReducer from "./slices/studentGradesSlice";

const store = configureStore({
  reducer: {
    studentGrades: studentGradesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
