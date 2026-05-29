import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EraserState {
  eraserSize: number;
}

const initialState: EraserState = {
  eraserSize: 5,
};

const eraserSlice = createSlice({
  name: "eraser",
  initialState,
  reducers: {
    setEraserSize: (state, action: PayloadAction<number>) => {
      state.eraserSize = action.payload;
    },
  },
});

// Export actions
export const { setEraserSize } = eraserSlice.actions;

// Export reducer
export default eraserSlice.reducer;
