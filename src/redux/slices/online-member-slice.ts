import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of each member in the online tracking system
type Member = {
  id: string;
};

type InitialStateProps = {
  members: Member[]; // A list of members who are currently online
};

const initialState: InitialStateProps = {
  members: [],
};

export const OnlineTracking = createSlice({
  name: "online",
  initialState,
  reducers: {
    // onOnline: Adds new members to the online list if they are not already present
    onOnline: (state, action: PayloadAction<Member[]>) => {
      // Create a Set of existing member IDs for quick lookup
      const existingIds = new Set(state.members.map((member) => member.id));

      // Filter out any new members that are already online
      const newMembers = action.payload.filter(
        (member) => !existingIds.has(member.id)
      );

      // If there are new members, add them to the state
      if (newMembers.length > 0) {
        state.members = [...state.members, ...newMembers];
      }
    },

    // onOffline: Removes members who are offline from the online list
    onOffline: (state, action: PayloadAction<Member[]>) => {
      // Create a Set of offline member IDs for quick lookup
      const offlineIds = new Set(action.payload.map((member) => member.id));

      // Filter out any members who are offline
      state.members = state.members.filter(
        (member) => !offlineIds.has(member.id)
      );
    },
  },
});

// Export the actions and reducer
export const { onOffline, onOnline } = OnlineTracking.actions;
export default OnlineTracking.reducer;
