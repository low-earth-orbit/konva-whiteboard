import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TextState {
  textSize: number;
  textStyle: string[];
  textColor: string;
  textAlignment: "left" | "center" | "right";
  lineSpacing: number;
}

const initialState: TextState = {
  textSize: 16,
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
    toggleTextStyle: (state, action: PayloadAction<string>) => {
      const style = action.payload;
      if (state.textStyle.includes(style)) {
        state.textStyle = state.textStyle.filter((s) => s !== style);
      } else {
        state.textStyle.push(style);
      }
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
    setTextAlignment: (
      state,
      action: PayloadAction<"left" | "center" | "right">,
    ) => {
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
  toggleTextStyle,
  setTextColor,
  setTextAlignment,
  setLineSpacing,
} = textSlice.actions;

// Export reducer
export default textSlice.reducer;
