import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";

import VideoPlayer from "./AppItems/AppPlayer2";
import LikeButton from "./LikeButton";
import CommentsDrawer from "./CommentsDrawer";
import PostDetails from "./PostDetails";
import MoreOptions from "./MoreOptions";
import useLazyLoad from "../hooks/useLazyLoad";

const styles = {
  container: {
    position: "relative",
    height: "100dvh",
    scrollSnapAlign: "start",
  },
  postDetails: {
    position: "absolute",
    bottom: 70,
    left: 10,
    width: "80%",
  },
  interactionContainer: {
    position: "absolute",
    right: 5,
    bottom: "16%",
    display: "flex",
    flexDirection: "column",
  },
};

const Post = ({ videoSrc, username, postContent, postId, likeCount, metadata }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useLazyLoad(ref, () => setIsLoaded(true));
  
  // Trigger video play/pause based on in-view status
  useEffect(() => {
    setIsInView(isLoaded);
  }, [isLoaded]);

  return (
    <Box ref={ref} sx={styles.container}>
      {isLoaded && (
        <>
          <VideoPlayer
            src={videoSrc}
            postId={postId}
            metadata={metadata}
            play={isInView}  // Control playing based on visibility
          />
          <Box sx={styles.postDetails}>
            <PostDetails username={username} postContent={postContent} />
          </Box>
          <Box sx={styles.interactionContainer}>
            <LikeButton likeCount={likeCount} postId={postId} />
            <CommentsDrawer postId={postId} />
            <MoreOptions
              options={[
                { text: "Report", link: `/report/${postId}` },
                { text: "Share", link: `/share/${postId}` },
              ]}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Post;
