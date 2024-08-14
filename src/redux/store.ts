import { configureStore } from "@reduxjs/toolkit";

import studentGradesReducer from "./slices/studentGradesSlice";
import studentProfileReducer from "./slices/studentProfileSlice";

const store = configureStore({
  reducer: {
    studentGrades: studentGradesReducer,
    studentProfile: studentProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
