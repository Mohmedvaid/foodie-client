// frontend/src/components/VideoPlayer.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";

import { setPlayingVideoId } from "../../store/videoSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../AppItems/AppLoader";

import videojs from "video.js";
import "video.js/dist/video-js.css";

const styles = {
  boxContainer: {
    position: "relative",
    height: "100%",
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: 60,
    color: "white",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
  },
  replayBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 3,
  },
};

const VideoPlayer = ({ src, postId, metadata }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null); // ref for videojs player
  const axios = useAxiosPrivate();
  const [isInView, setIsInView] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [accumulatedDuration, setAccumulatedDuration] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize Video.js player
    const videoElement = videoRef.current;
    if (videoElement) {
      const vjsPlayer = videojs(videoElement, {
        controls: true,
        autoplay: false,
        responsive: true,
        fill: true,
        sources: [{ src, type: "application/x-mpegURL" }], // Assume HLS, but can be dynamic
      });

      vjsPlayer.on("waiting", () => setIsLoading(true));
      vjsPlayer.on("canplay", () => setIsLoading(false));
      vjsPlayer.on("ended", handleVideoEnd);

      return () => {
        if (vjsPlayer) {
          vjsPlayer.dispose();
        }
      };
    }
  }, [src]);

  const replayVideo = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setShowReplay(false);
      videoElement.play();
      setStartTime(0); // Reset start time for new loop
    }
  };

  const sendViewInteraction = useCallback(async () => {
    if (startTime != null && videoRef.current) {
      const viewDuration = videoRef.current.currentTime - startTime;
      if (viewDuration > 0) {
        const newAccumulatedDuration = accumulatedDuration + viewDuration;
        setAccumulatedDuration(newAccumulatedDuration); // Update the accumulated duration

        try {
          await axios.post("/interaction", {
            postId,
            type: "VIEW",
            duration: newAccumulatedDuration, // Send total duration including this view
            postDuration: metadata.duration,
          });
          console.log("View interaction sent");
        } catch (err) {
          console.error("Error sending view interaction:", err);
        }
      }
    }
  }, [axios, postId, startTime, accumulatedDuration]);

  const observerCallback = useCallback(
    (entries) => {
      const [entry] = entries;
      const videoElement = videoRef.current;

      if (entry.isIntersecting) {
        setIsInView(true);
        dispatch(setPlayingVideoId(postId));
        if (videoElement && !videoElement.paused && !isPlaying) {
          videoElement
            .play() // Auto play only if not already paused by user
            .then(() => {
              setIsPlaying(true);
              setStartTime(videoElement.currentTime);
              setShowReplay(false);
            })
            .catch((error) => {
              console.error("Error attempting to play the video:", error);
            });
        }
      } else {
        setIsInView(false);
        if (videoElement && isPlaying) {
          videoElement.pause(); // Pause only if it was playing
          setIsPlaying(false);
        }
        setStartTime(null);
        // Send view interaction if needed
        if (startTime != null) sendViewInteraction();
      }
    },
    [sendViewInteraction, startTime, isPlaying]
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    let observer;

    if (videoElement) {
      observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5,
      });
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement && observer) observer.unobserve(videoElement);
    };
  }, [observerCallback]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && isInView) {
      videoElement.currentTime = 0; // Reset the time before attempting to play
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setStartTime(0);
            setIsPlaying(true);
          })
          .catch(console.error);
      }
    }
  }, [isInView]);

  const handleVideoEnd = () => {
    if (isInView) {
      // Only show replay if the video is in view
      setShowReplay(true);
      setStartTime(null);
      sendViewInteraction();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) videoElement.addEventListener("ended", handleVideoEnd);

    return () => {
      if (videoElement)
        videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, [sendViewInteraction, isInView]);

  return (
    <Box sx={styles.boxContainer}>
      {isLoading && <Loader />}
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
      {showReplay && (
        <Box sx={styles.replayBox} onClick={replayVideo}>
          Replay
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
