import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./canvasSlice";
import shapeReducer from "./shapeSlice";
import textReducer from "./textSlice";

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    shape: shapeReducer,
    text: textReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
