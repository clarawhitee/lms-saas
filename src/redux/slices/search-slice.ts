import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a group
export type GroupStateProps = {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  htmlDescription: string | null;
  userId: string;
  thumbnail: string | null;
  description: string | null;
  privacy: "PUBLIC" | "PRIVATE";
  jsonDescription: string | null;
  gallery: string[];
};

// Define the structure of the search state
type InitialStateProps = {
  isSearching: boolean;
  status?: number;
  data: GroupStateProps[];
  debounce: string;
};

const initialState: InitialStateProps = {
  isSearching: false,
  status: undefined,
  data: [],
  debounce: "",
};

export const Search = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Handle search action, updating the state only with the relevant parts
    onSearch: (state, action: PayloadAction<Partial<InitialStateProps>>) => {
      // Only update relevant fields to avoid overwriting the whole state
      if (action.payload.isSearching !== undefined) {
        state.isSearching = action.payload.isSearching;
      }
      if (action.payload.status !== undefined) {
        state.status = action.payload.status;
      }
      if (action.payload.data) {
        state.data = action.payload.data;
      }
      if (action.payload.debounce !== undefined) {
        state.debounce = action.payload.debounce;
      }
    },

    // Clear the search data and reset specific parts of the state
    onClearSearch: (state) => {
      // Reset only necessary parts, leaving others intact
      state.data = [];
      state.isSearching = false;
      state.status = undefined;
      state.debounce = "";
    },

    // Optional: debounce action to handle input debouncing in the UI
    onDebounceChange: (state, action: PayloadAction<string>) => {
      state.debounce = action.payload;
    },
  },
});

export const { onSearch, onClearSearch, onDebounceChange } = Search.actions;
export default Search.reducer;
