import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "light",
};

const themeSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLightTheme: (state, _action) => {
      state.value = "light";
    },
    setDarkTheme: (state, _action) => {
      state.value = "dark";
    },
  },
});

export const { setLightTheme, setDarkTheme } = themeSlice.actions;

export default themeSlice.reducer;
