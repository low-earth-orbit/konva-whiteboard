import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InkState {
  inkWidth: number;
  inkColor: string;
}

const initialState: InkState = {
  inkWidth: 5,
  inkColor: "#2986cc",
};

const inkSlice = createSlice({
  name: "ink",
  initialState,
  reducers: {
    setInkWidth: (state, action: PayloadAction<number>) => {
      state.inkWidth = action.payload;
    },
    setInkColor: (state, action: PayloadAction<string>) => {
      state.inkColor = action.payload;
    },
  },
});

// Export actions
export const { setInkWidth, setInkColor } = inkSlice.actions;

// Export reducer
export default inkSlice.reducer;
