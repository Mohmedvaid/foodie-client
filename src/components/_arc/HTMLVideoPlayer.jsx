// frontend/src/components/VideoPlayer.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { Slider } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { setPlayingVideoId } from "../../store/videoSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "./AppItems/Loader";

const styles = {
  boxContainer: {
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
  slider: {
    position: "absolute",
    bottom: 10,
    right: 10,
    left: 10,
    width: "calc(100% - 20px)",
  },
};

const VideoPlayer = ({ src, postId, metadata }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const axios = useAxiosPrivate();
  const [isInView, setIsInView] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [accumulatedDuration, setAccumulatedDuration] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleCanPlayThrough = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);

    const checkBuffering = () => {
      const videoElement = videoRef.current;
      if (videoElement?.buffered.length > 0) {
        const bufferEnd = videoElement.buffered.end(
          videoElement.buffered.length - 1
        );
        if (videoElement.currentTime > bufferEnd - 0.5) setIsLoading(true);
        else setIsLoading(false);
      }
    };

    const updateSlider = () => {
      const currentTime = videoElement?.currentTime;
      const duration = videoElement?.duration;
      setSliderValue((currentTime / duration) * 100);
    };

    videoElement?.addEventListener("waiting", handleWaiting);
    videoElement?.addEventListener("canplaythrough", handleCanPlayThrough);
    videoElement?.addEventListener("timeupdate", checkBuffering);
    videoElement?.addEventListener("timeupdate", updateSlider);

    return () => {
      videoElement?.removeEventListener("waiting", handleWaiting);
      videoElement?.removeEventListener("canplaythrough", handleCanPlayThrough);
      videoElement?.removeEventListener("timeupdate", checkBuffering);
      videoElement?.removeEventListener("timeupdate", updateSlider);
      if (videoElement) videoElement.currentTime = 0;
    };
  }, []);

  const handleSliderChange = (event, newValue) => {
    const videoElement = videoRef.current;
    const duration = videoElement.duration;
    setSliderValue(newValue);
    videoElement.currentTime = (newValue / 100) * duration;
  };

  const handleSliderChangeStart = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleSliderChangeEnd = () => {
    if (isInView) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement
        .play()
        .then(() => {
          setShowReplay(false);
          setIsPlaying(true);
          setStartTime(videoElement.currentTime);
        })
        .catch(console.error);
    } else {
      videoElement.pause();
      setIsPlaying(false);

      // send view interaction if the video is paused
      sendViewInteraction();

      // Only reset startTime if the video is in view
      if (isInView) setStartTime(null);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoEnd = () => {
      if (isInView) {
        // Only show replay if the video is in view
        setShowReplay(true);
        setStartTime(null);
        sendViewInteraction();
        setIsLoading(false);
      }
    };

    if (videoElement) videoElement.addEventListener("ended", handleVideoEnd);

    return () => {
      if (videoElement)
        videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, [sendViewInteraction, isInView]);

  return (
    <Box sx={styles.boxContainer}>
      {isLoading && <Loader />}
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        onClick={togglePlayPause}
        muted
        playsInline
        // controls={true}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {!isPlaying && !showReplay && !isLoading && (
        <PlayCircleOutlineIcon sx={styles.playIcon} onClick={togglePlayPause} />
      )}
      {showReplay && (
        <Box sx={styles.replayBox} onClick={replayVideo}>
          Replay
        </Box>
      )}
      <Slider
        size="small"
        sx={styles.slider}
        value={sliderValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeEnd}
        onMouseDown={handleSliderChangeStart}
        onTouchStart={handleSliderChangeStart}
      />
    </Box>
  );
};

export default VideoPlayer;
