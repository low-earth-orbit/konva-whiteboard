import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isSidePanelOpen: boolean;
}

const initialState: SettingsState = {
  isSidePanelOpen: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsSidePanelOpen(state, action: PayloadAction<boolean>) {
      state.isSidePanelOpen = action.payload;
    },
  },
});

export const { setIsSidePanelOpen } = settingsSlice.actions;

export default settingsSlice.reducer;
