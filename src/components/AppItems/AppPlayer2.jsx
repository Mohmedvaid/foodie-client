// frontend/src/components/VideoPlayer.js
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useDispatch, useSelector } from "react-redux";
import { setMuteState, setPlayingVideoId } from "../../store/videoSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import debounce from "../../utils/debounce";

const styles = {
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
    pointerEvents: "none",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    pointerEvents: "all",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

const VideoPlayer = ({src,  metadata, postId, play }) => {

  const dispatch = useDispatch();
  const axios = useAxiosPrivate();
  const playerRef = useRef();
  const { isMuted } = useSelector((state) => state.video);
  const [playing, setPlaying] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [played, setPlayed] = useState(0);

  useEffect(() => {
    const player = videojs(playerRef.current, {
      autoplay: false, // Disable autoplay to control play manually
      muted: isMuted,
      controls: false, // We are using custom controls
      responsive: true,
      fill: true,
      sources: [{ src, type: "application/x-mpegURL" }],
    });

    player.on("timeupdate", () => {
      const progress = player.currentTime() / player.duration();
      setPlayed(progress);
    });

    player.on("pause", () => setPlaying(false));
    player.on("play", () => setPlaying(true));

    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting) {
          player.pause();
          player.currentTime(0);
          setPlaying(false);
        } else {
          dispatch(setPlayingVideoId(postId));
          player.play();
        }
      }, 100),
      {
        rootMargin: "0px", // no margin
        threshold: 0.5, // 50% of the video is in view
      }
    );

    observer.observe(playerRef.current);

    return () => {
      observer.disconnect();
      player.dispose();
    };
  }, [src, dispatch, postId, axios]);

  const handlePlayPause = () => {
    const player = videojs(playerRef.current);
    playing ? player.pause() : player.play();
  };

  const toggleMute = () => dispatch(setMuteState(!isMuted));

  useEffect(() => {
    const player = videojs(playerRef.current);
    player.muted(isMuted);
  }, [isMuted]);

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
      </div>
      <Box sx={styles.controlsWrapper}>
        <Box flexGrow={1} />
        <Box sx={styles.controls}>
          <IconButton onClick={toggleMute} color="primary">
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
          <IconButton onClick={handlePlayPause} color="primary" sx={{ mr: 1 }}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={played}
            onChange={(_, newValue) => {
              videojs(playerRef.current).currentTime(
                newValue * videojs(playerRef.current).duration()
              );
            }}
            sx={{ color: "primary.main", width: "100%" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
