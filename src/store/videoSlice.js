// frontend/src/store/videoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate } from "../config/axios";

const initialState = {
  videos: [],
  hasMore: true,
  loading: false,
  error: false,
  playingVideoId: null,
  nextVideoId: null,
  errorMsg: "",
  isMuted: true,
};

// Async thunk to fetch videos
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { hasMore } = getState().video;

      if (!hasMore) return;
      console.log("Fetching videos...");

      const response = await axiosPrivate.get("/post/");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const selectCurrentVideoIndex = (state) => {
  return state.video.videos.findIndex(
    (video) => video._id === state.video.playingVideoId
  );
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    playVideo: (state, action) => {
      const currentVideoIndex = state.videos.findIndex(
        (video) => video._id === action.payload
      );
      const nextVideoId = state.videos[currentVideoIndex + 1]?._id;
      state.playingVideoId = action.payload;
      state.nextVideoId = nextVideoId;
    },
    pauseVideo: (state) => {
      state.playingVideoId = null;
    },
    setPlayingVideoId: (state, action) => {
      state.playingVideoId = action.payload;
    },
    setMuteState: (state, action) => {
      state.isMuted = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        const newVideos = action.payload.filter(
          (newVideo) =>
            !state.videos.some((video) => video._id === newVideo._id)
        );
        state.videos = [...state.videos, ...newVideos];
        state.hasMore = action.payload.length > 0;
        state.loading = false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.hasMore = false;
        state.videos = [];
        state.errorMsg = action.payload?.message || "Failed to fetch videos";
      });
  },
});

export const { playVideo, pauseVideo, setPlayingVideoId, setMuteState } =
  videoSlice.actions;
export default videoSlice.reducer;
