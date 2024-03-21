// frontend/src/components/profile/VideoCard.jsx
import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import ReactPlayer from "react-player";

const VideoCard = ({ video }) => {
  const videoUrl = video.url || null;
  const description = video.description || "No description";
  const likes = video.likeCount || 0;
  const views = video.viewCount || 0;

  return (
    <Card>
      {/* React Player for video playback */}
      <ReactPlayer
        url={videoUrl}
        // TODO: add lazy loading here and use a preview image. use backend to generate image from video on upload
        width="100%"
        height="100%"
        style={{ aspectRatio: "16/9" }}
        controls // Display player controls
      />
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2">Likes: {likes}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Views: {views}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
