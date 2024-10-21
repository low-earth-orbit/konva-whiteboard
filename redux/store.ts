import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./canvasSlice";
import shapeReducer from "./shapeSlice";
import textReducer from "./textSlice";
import inkReducer from "./inkSlice";
import eraserReducer from "./eraserSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    shape: shapeReducer,
    text: textReducer,
    ink: inkReducer,
    eraser: eraserReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
