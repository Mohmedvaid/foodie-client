import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { fetchVideos, selectCurrentVideoIndex } from "../store/videoSlice";
import Post from "./Post";
import Loader from "./AppItems/AppLoader";

const styles = {
  feedBox: {
    height: "100dvh",
    scrollSnapType: "y mandatory",
    // hide scrollbar
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};

const Feed = () => {
  const dispatch = useDispatch();
  const currentVideoIndex = useSelector(selectCurrentVideoIndex);
  const { videos, hasMore, loading, error, errorMsg } = useSelector(
    (state) => state.video
  );
  const [lastVideoId, setLastVideoId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (videos.length === 0 && !loading && hasMore) {
      dispatch(fetchVideos());
    } else {
      if (errorMsg) {
        setMessage(errorMsg);
      } else {
        setMessage("No videos found.");
      }
    }
  }, [videos.length, loading, hasMore, dispatch]);

  const loadMoreVideos = useCallback(() => {
    if (hasMore && !loading && videos.length - currentVideoIndex <= 2) {
      // Check if the last video in the list is different from the last fetched video
      const lastFetchedVideoId = videos[videos.length - 1]?._id;
      if (lastVideoId !== lastFetchedVideoId) {
        dispatch(fetchVideos());
        setLastVideoId(lastFetchedVideoId);
      }
    }
  }, [
    currentVideoIndex,
    hasMore,
    loading,
    videos.length,
    dispatch,
    lastVideoId,
  ]);

  useEffect(() => {
    loadMoreVideos();
  }, [currentVideoIndex, loadMoreVideos]);

  const renderVideos = () => {
    return videos.map((video, index) => (
      <React.Fragment key={`${video._id}${index}`}>
        <Post
          videoSrc={video.url}
          postContent={video.description}
          username={video.user?.username}
          postId={video._id}
          likeCount={video.likeCount}
          metadata={video.metadata}
        />
        {index < videos.length - 1 && <Divider sx={styles.divider} />}
      </React.Fragment>
    ));
  };

  const renderMessage = () => {
    return error && errorMsg ? (
      <Typography variant="h6">{message}</Typography>
    ) : (
      <Typography variant="h6">No videos found.</Typography>
    );
  };

  const renderContent = () => {
    if (loading && videos.length === 0) return <Loader />;
    if (error && errorMsg)
      return <Typography variant="h6">{errorMsg}</Typography>;
    return renderVideos();
  };

  return (
    <Box
      sx={{
        ...styles.feedBox,
        overflowY: hasMore && !loading ? "scroll" : "hidden",
      }}
    >
      {renderContent()}
    </Box>
  );
};

export default Feed;
