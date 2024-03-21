// frontend/src/store/store.js
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import videoReducer from "./videoSlice";
// Import other reducers

const rootReducer = combineReducers({
  auth: authReducer,
  video: videoReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // middleware and other store settings
});
