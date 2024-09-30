import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TextState {
  textSize: number;
  textStyle: string[];
  textColor: string;
  textAlignment: string;
  lineSpacing: number;
}

const initialState: TextState = {
  textSize: 28,
  textStyle: [],
  textColor: "#000000",
  textAlignment: "left",
  lineSpacing: 1.5,
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    setTextSize: (state, action: PayloadAction<number>) => {
      state.textSize = action.payload;
    },
    setTextStyle: (state, action: PayloadAction<string[]>) => {
      state.textStyle = action.payload;
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
    setTextAlignment: (state, action: PayloadAction<string>) => {
      state.textAlignment = action.payload;
    },
    setLineSpacing: (state, action: PayloadAction<number>) => {
      state.lineSpacing = action.payload;
    },
  },
});

// Export actions
export const {
  setTextSize,
  setTextStyle,
  setTextColor,
  setTextAlignment,
  setLineSpacing,
} = textSlice.actions;

// Export reducer
export default textSlice.reducer;
