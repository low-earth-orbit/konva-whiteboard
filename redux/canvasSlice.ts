import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CanvasObjectType, ToolType } from "../components/Canvas";

interface CanvasState {
  canvasObjects: CanvasObjectType[];
  undoStack: CanvasObjectType[][];
  redoStack: CanvasObjectType[][];
  selectedObjectId: string;
}

const initialState: CanvasState = {
  canvasObjects:
    typeof window !== "undefined" && localStorage.getItem("canvasState")
      ? JSON.parse(localStorage.getItem("canvasState") || "[]")
      : [],
  undoStack: [],
  redoStack: [],
  selectedObjectId: "",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCanvasObjects(state, action: PayloadAction<CanvasObjectType[]>) {
      state.canvasObjects = action.payload;
    },
    addCanvasObject(state, action: PayloadAction<CanvasObjectType>) {
      state.undoStack.push(state.canvasObjects);
      state.canvasObjects = [...state.canvasObjects, action.payload];
      state.redoStack = [];
    },
    updateCanvasObject(
      state,
      action: PayloadAction<{ id: string; updates: Partial<CanvasObjectType> }>,
    ) {
      state.undoStack.push(state.canvasObjects);
      state.canvasObjects = state.canvasObjects.map((object) =>
        object.id === action.payload.id
          ? { ...object, ...action.payload.updates }
          : object,
      );
      state.redoStack = [];
    },
    deleteCanvasObject(state, action: PayloadAction<string>) {
      state.undoStack.push(state.canvasObjects);
      state.canvasObjects = state.canvasObjects.filter(
        (obj) => obj.id !== action.payload,
      );
      state.selectedObjectId = "";
      state.redoStack = [];
    },
    selectCanvasObject(state, action: PayloadAction<string>) {
      state.selectedObjectId = action.payload;
    },
    resetCanvas(state) {
      state.undoStack = [];
      state.canvasObjects = [];
      state.selectedObjectId = "";
      state.redoStack = [];
    },
    undo(state) {
      if (state.undoStack.length > 0) {
        state.redoStack.push(state.canvasObjects);
        state.canvasObjects = state.undoStack.pop()!;
      }
    },
    redo(state) {
      if (state.redoStack.length > 0) {
        state.undoStack.push(state.canvasObjects);
        state.canvasObjects = state.redoStack.pop()!;
      }
    },
  },
});

export const {
  setCanvasObjects,
  addCanvasObject,
  updateCanvasObject,
  deleteCanvasObject,
  selectCanvasObject,
  resetCanvas,
  undo,
  redo,
} = canvasSlice.actions;

export default canvasSlice.reducer;
