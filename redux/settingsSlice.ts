import { ToolType } from "@/components/Canvas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isSidePanelOpen: boolean;
  selectedTool: ToolType;
}

const initialState: SettingsState = {
  isSidePanelOpen: false,
  selectedTool: "pen",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsSidePanelOpen(state, action: PayloadAction<boolean>) {
      state.isSidePanelOpen = action.payload;
    },
    updateSelectedTool(state, action: PayloadAction<ToolType>) {
      state.selectedTool = action.payload;
    },
  },
});

export const { setIsSidePanelOpen, updateSelectedTool } = settingsSlice.actions;

export default settingsSlice.reducer;
