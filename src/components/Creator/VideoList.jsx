import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";

import VideoCard from "./VideoCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../AppItems/AppLoader";

const VideoList = ({ username }) => {
  const GET_USER_VIDEOS_URL = `/post/creator/${username}`;

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
          console.log("Last video in view, fetching next page");
          setPage((prevPage) => prevPage + 1);
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
          params: { page, limit: 10 },
        });
        const data = response.data.data;
        setTotalPages(data.pagination.totalPages);
        setVideos((prevVideos) => [...prevVideos, ...data.posts]);
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
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
        {videos.map((video, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={video.id}
            ref={index === videos.length - 1 ? lastVideoElementRef : null}
          >
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
      {loading && <Loader />}
    </Box>
  );
};

export default VideoList;
