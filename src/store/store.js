// frontend/src/store/store.js
/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { refreshAuthToken } from "./auth.slice";
import { setupInterceptors } from "../config/axios";

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // middleware and other store settings
});

setupInterceptors(store, { refreshAuthToken });

export default store;
