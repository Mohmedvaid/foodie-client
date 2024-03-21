// src/components/Comment/Comment.jsx
import React from "react";
import { Typography, Card, CardContent } from "@mui/material";

const Comment = ({ username, text }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{username}</Typography>
      <Typography variant="body2">{text}</Typography>
    </CardContent>
  </Card>
);

export default Comment;
