import {
  StudentGradesStateType,
  StudentGradesType,
} from "@/types/student-grades/studentGradesTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StudentGradesStateType = {
  studentGrades: "",
};

const studentGradesSlice = createSlice({
  name: "studentGrades",
  initialState,
  reducers: {
    setStudentGrades: (
      state: StudentGradesStateType,
      action: PayloadAction<string>
    ) => {
      state.studentGrades = action.payload;
      //   state.studentGrades = JSON.parse(action.payload);
    },
  },
});

export const { setStudentGrades } = studentGradesSlice.actions;
export default studentGradesSlice.reducer;
