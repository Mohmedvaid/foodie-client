// frontend/src/components/profile/VideoList.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import VideoCard from "./VideoCard"; // A component to display individual videos
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../AppItems/AppLoader";

const GET_USER_VIDEOS_URL = "/post/me";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const axiosPrivate = useAxiosPrivate();

  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages]
  );

  useEffect(() => {
    setLoading(true);
    const fetchVideos = async () => {
      try {
        const response = await axiosPrivate.get(GET_USER_VIDEOS_URL, {
          params: { page },
        });
        const { posts, totalPages } = response.data.data;
        setTotalPages(totalPages);
        setVideos((prevVideos) => {
          const newVideos = posts.filter(
            (post) => !prevVideos.some((video) => video.id === post.id)
          );
          return [...prevVideos, ...newVideos];
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, axiosPrivate]);

  if (!loading && videos.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography variant="subtitle1">No uploads yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {videos.map((video, index) => {
          const isLastVideo = videos.length === index + 1 && page < totalPages;
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={video.id} // Assuming each video object has a unique 'id'
              ref={isLastVideo ? lastVideoElementRef : null}
            >
              <VideoCard video={video} />
            </Grid>
          );
        })}
      </Grid>
      {loading && <Loader />}
    </Box>
  );
};

export default VideoList;
