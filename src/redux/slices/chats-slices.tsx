import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatMessage = {
  id: string;
  message: string;
  createdAt: Date;
  senderId: string | null;
  receiverId: string | null;
};

type InitialStateProps = {
  chat: ChatMessage[];
};

const initialState: InitialStateProps = {
  chat: [],
};

// Helper function to check if a message is already in the chat list
const isDuplicateMessage = (existingMessages: ChatMessage[], newMessages: ChatMessage[]) => {
  const existingIds = new Set(existingMessages.map((msg) => msg.id));
  return newMessages.filter((msg) => !existingIds.has(msg.id));
};

// Define the slice
export const onChats = createSlice({
  name: "chats",
  initialState,
  reducers: {
    // Action to add new chat messages, avoiding duplicates
    onChat: (state, action: PayloadAction<ChatMessage[]>) => {
      const newMessages = action.payload;

      // Filter out duplicate messages
      const uniqueMessages = isDuplicateMessage(state.chat, newMessages);

      // Add unique messages to the state
      state.chat = state.chat.concat(uniqueMessages);
    },
  },
});

export const { onChat } = onChats.actions;
export default onChats.reducer;
