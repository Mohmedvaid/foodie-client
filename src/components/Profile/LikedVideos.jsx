// frontend/src/components/profile/LikedVideos.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import VideoCard from "./VideoCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GET_LIKED_VIDEOS_URL = "/post/me/liked";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
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
    const fetchLikedVideos = async () => {
      try {
        const response = await axiosPrivate.get(GET_LIKED_VIDEOS_URL, {
          params: { page },
        });
        const { posts, totalPages } = response.data.data;
        setTotalPages(totalPages);
        setLikedVideos((prevVideos) => {
          const newVideos = posts.filter(
            (post) => !prevVideos.some((video) => video.id === post.id)
          );
          return [...prevVideos, ...newVideos];
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load liked videos:", error);
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, [page, axiosPrivate]);

  if (!loading && likedVideos.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography variant="subtitle1">No liked videos yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {likedVideos.map((video, index) => {
          const isLastVideo =
            likedVideos.length === index + 1 && page < totalPages;
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={video.id}
              ref={isLastVideo ? lastVideoElementRef : null}
            >
              <VideoCard video={video} />
            </Grid>
          );
        })}
      </Grid>
      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1">Loading more videos...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default LikedVideos;
