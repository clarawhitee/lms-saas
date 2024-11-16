import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the shape of each item in the list (replace with your actual data shape)
type Item = {
  id: string;
  // Add other fields relevant to your data
};

type InitialStateProps = {
  data: Item[]; // Use a more specific type for the data array
};

const initialState: InitialStateProps = {
  data: [],
};

export const InfiniteScroll = createSlice({
  name: "InfiniteScroll",
  initialState,
  reducers: {
    // onInfiniteScroll: Handles merging new data into the existing state
    onInfiniteScroll: (state, action: PayloadAction<Item[]>) => {
      // Create a Set for tracking unique IDs to avoid duplicates
      const existingIds = new Set(state.data.map((item) => item.id));

      // Filter out items from the payload that already exist in the state
      const newItems = action.payload.filter((item) => !existingIds.has(item.id));

      // Append only the new, unique items to the data array
      state.data = [...state.data, ...newItems];
    },

    // onClearList: Resets the list with the new data (useful for resetting pagination)
    onClearList: (state, action: PayloadAction<Item[]>) => {
      state.data = action.payload;
    },
  },
});

export const { onInfiniteScroll, onClearList } = InfiniteScroll.actions;
export default InfiniteScroll.reducer;
