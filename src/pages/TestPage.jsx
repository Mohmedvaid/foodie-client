import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../config/axios";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import Video.js CSS

const styles = {
  video: {
    minHeight: "100%",
    minWidth: "100%",

    width: "auto",
    height: "auto",

    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const TestPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null); // Ref for the video element

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosPrivate.get(`/post/${id}`);
        const videoUrl = response.data.data.url;

        // Initialize Video.js after fetching video URL
        if (videoRef.current) {
          const player = videojs(videoRef.current, {
            controls: true,
            responsive: true,
            fill: true,
            sources: [
              {
                src: videoUrl,
                type: "application/x-mpegURL",
              },
            ],
          });

          setLoading(false);

          return () => {
            if (player) player.dispose(); // Dispose of the player on component unmount
          };
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <>
      {!id && <Box>No video ID provided</Box>}
      {loading && <Box>Loading...</Box>}
      {error && <Box>Error: {error}</Box>}
      <Box sx={styles.container}>
        <div data-vjs-player style={styles.video}>
          <video ref={videoRef} className="video-js" />
        </div>
      </Box>
    </>
  );
};

export default TestPage;
