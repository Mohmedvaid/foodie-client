// src/components/AppItems/AppPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player/lazy";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { setPlayingVideoId, setMuteState } from "../../store/videoSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import debounce from "../../utils/debounce";

const styles = {
  container: {
    position: "relative",
    height: "100%",
  },
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
  },
  controls: {
    display: "flex",
    alignItems: "center",
    px: "10px",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

const VideoPlayer = ({ src, metadata, postId }) => {
  const dispatch = useDispatch();
  const axios = useAxiosPrivate();
  const { isMuted } = useSelector((state) => state.video);
  const [watchTime, setWatchTime] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);

  const playerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        if (!isVisible) {
          sendWatchTime();
        } else {
          dispatch(setPlayingVideoId(postId));
          // Reset watch time on becoming visible
          setWatchTime(0);
          setPlaying(true);
        }
      }, 100),
      {
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const playerElement = playerRef.current;
    if (playerElement && playerElement.wrapper) {
      observer.observe(playerElement.wrapper);
    }

    return () => {
      if (playerElement && playerElement.wrapper) {
        observer.unobserve(playerElement.wrapper);
      }
      observer.disconnect();
      sendWatchTime();
    };
  }, [dispatch, postId, playerRef]);

  // Effect to manage watch time accumulation
  useEffect(() => {
    let intervalId;
    if (isIntersecting) {
      intervalId = setInterval(() => {
        setWatchTime((wt) => wt + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isIntersecting]);

  const sendWatchTime = async () => {
    if (watchTime > 0) {
      try {
        await axios.post("/interaction", {
          postId,
          type: "VIEW",
          duration: watchTime,
          postDuration: metadata.duration,
        });
      } catch (err) {
        console.error("Error sending watch time:", err);
      }
    }
  };

  // Mute state synchronization
  const handleMuteChange = (muted) => {
    dispatch(setMuteState(muted));
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  // new
  const toggleMute = () => {
    dispatch(setMuteState(!isMuted));
  };

  return (
    <Box sx={styles.container}>
      <ReactPlayer
        ref={playerRef}
        url={src}
        width="100%"
        height="100%"
        playing={playing && isIntersecting}
        controls={false}
        muted={isMuted}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          sendWatchTime();
        }}
        onProgress={handleProgress}
        playsinline
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
        autoPlay
      />

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
            size="small"
            min={0}
            max={1}
            step={0.01}
            value={played}
            onChange={(_, newValue) => {
              playerRef.current.seekTo(newValue, "fraction");
            }}
            sx={{ color: "primary.main" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
