import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  // TODO: fix type
  studentProfile: [],
};

//Fix type on reducers
const studentProfileSlice = createSlice({
  name: "studentProfile",
  initialState,
  reducers: {
    setStudentProfile: (state, action: PayloadAction<any>) => {
      state.studentProfile = action.payload;
    },
  },
});

export const { setStudentProfile } = studentProfileSlice.actions;
export default studentProfileSlice.reducer;
