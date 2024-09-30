import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShapeState {
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
}

const initialState: ShapeState = {
  strokeWidth: 5,
  strokeColor: "#2986cc",
  fillColor: "#FFFFFF",
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strokeWidth = action.payload;
    },
    setStrokeColor(state, action: PayloadAction<string>) {
      state.strokeColor = action.payload;
    },
    setFillColor(state, action: PayloadAction<string>) {
      state.fillColor = action.payload;
    },
  },
});

export const { setStrokeWidth, setStrokeColor, setFillColor } =
  shapeSlice.actions;
export default shapeSlice.reducer;
