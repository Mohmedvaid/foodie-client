// frontend/src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosPrivateForFiles } from "../config/axios";
const REGISTER_URL = "/auth/signup";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
  persist: JSON.parse(localStorage.getItem("persist")) || true,
  roles: [],
  profilePicture: null,
  isInitialLogin: false,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      if (err.response) return rejectWithValue(err.response?.data);
      return rejectWithValue(err);
    }
  }
);

// Async thunk for refreshing token
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshAuthToken",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    if (!state.auth.persist) return;

    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER_URL, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // Handle response data as needed
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk update user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosPrivateForFiles.put("/user", userData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.roles = [];
      localStorage.removeItem("persist");
    },
    togglePersist: (state) => {
      state.persist = !state.persist;
      localStorage.setItem("persist", state.persist);
    },
    setInitialLoading: (state, action) => {
      state.initialLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login thunks
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = ""; // Clear any previous errors
        state.roles = action.payload.roles;
        state.isInitialLogin = action.payload.isInitialLogin;
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload; // TODO: create a axios error handler utility
        state.user = null;
        state.accessToken = null;
        state.roles = [];
      });

    // Handle refreshAuthToken thunks
    builder
      .addCase(refreshAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.newToken;
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = "Authentication failed";
        state.roles = [];
      });

    // Handle signup thunks
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.roles = action.payload.roles;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
        state.isInitialLogin = action.payload.isInitialLogin;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.user = null;
        state.accessToken = null;
        state.roles = [];
      });

    // Handle updateUser thunks
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = state.user;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload.message;
      });
  },
});

export const { logout, togglePersist } = authSlice.actions;
export default authSlice.reducer;
