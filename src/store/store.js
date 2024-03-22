// frontend/src/store/store.js
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// Import other reducers

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // middleware and other store settings
});
