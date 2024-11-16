"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"

// Import your slice reducers
import chatSlice from "./slices/chats-slice"
import infiniteScrollSlice from "./slices/infinite-scroll-slice"
import onlineTrackingSlice from "./slices/online-member-slice"
import searchSlice from "./slices/search-slice"

// Combine the reducers into a single root reducer
const rootReducer = combineReducers({
  search: searchSlice,
  onlineTracking: onlineTrackingSlice,
  infiniteScroll: infiniteScrollSlice,
  chat: chatSlice,
})

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
})

// Define RootState and AppDispatch types for type safety
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Create a strongly typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
