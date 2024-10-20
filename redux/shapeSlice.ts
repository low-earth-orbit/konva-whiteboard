import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShapeState {
  borderWidth: number;
  borderColor: string;
  fillColor: string;
}

const initialState: ShapeState = {
  borderWidth: 5,
  borderColor: "#2986cc",
  fillColor: "#FFFFFF",
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setBorderWidth(state, action: PayloadAction<number>) {
      state.borderWidth = action.payload;
    },
    setBorderColor(state, action: PayloadAction<string>) {
      state.borderColor = action.payload;
    },
    setFillColor(state, action: PayloadAction<string>) {
      state.fillColor = action.payload;
    },
  },
});

export const { setBorderWidth, setBorderColor, setFillColor } =
  shapeSlice.actions;
export default shapeSlice.reducer;
