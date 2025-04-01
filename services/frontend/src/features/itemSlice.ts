import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  name: string;
  id: string;
  userId: string;
  checked: string;
}

export interface ItemState {
  value: Item[];
}

const initialState: ItemState = {
  value: [],
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.value = [...state.value, action.payload];
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.value = [...state.value, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem } = itemSlice.actions;

export default itemSlice.reducer;
