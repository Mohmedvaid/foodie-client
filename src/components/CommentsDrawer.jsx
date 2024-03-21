import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Typography from "@mui/material/Typography";

import Button from "./AppItems/AppButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CommentItem from "./CommentItem";

const COMMENTS_URL = "/comments";

const CommentsDrawer = ({ postId }) => {
  const username = useSelector((state) => state.auth.user.username);

  const axios = useAxiosPrivate();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleOpenDialog = (commentId) => {
    setOpenDialog(true);
    setCommentToDelete(commentId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCommentToDelete(null);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchComments();
  };

  const startEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    setCommentText(commentToEdit.text);
  };

  const updateComment = async (commentId, newText) => {
    try {
      await axios.put(`${COMMENTS_URL}`, {
        text: newText,
        commentId,
      });
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${COMMENTS_URL}/${postId}`);

      if (Array.isArray(response.data.data)) {
        const sortedComments = response.data.data.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setComments(sortedComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]); // Set to empty array in case of error
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const submitComment = async () => {
    try {
      await axios.post(COMMENTS_URL, {
        postId: postId,
        text: commentText,
      });
      setCommentText(""); // Clear the input field after submitting
      fetchComments(); // Fetch comments again to update the list
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(COMMENTS_URL, { data: { commentId, postId } });
      fetchComments();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const deleteCommentHandler = (commentId) => {
    handleOpenDialog(commentId);
  };

  const memoizedComments = useMemo(() => {
    return comments.map((comment) => (
      <CommentItem
        key={comment._id}
        comment={comment}
        username={username}
        onDelete={deleteCommentHandler}
        onStartEdit={startEditComment} // Pass startEditComment function
        onUpdate={updateComment} // Pass updateComment function
      />
    ));
  }, [
    comments,
    username,
    deleteCommentHandler,
    startEditComment,
    updateComment,
  ]);

  return (
    <>
      <Box sx={{ padding: "12px" }}>
        <IconButton onClick={toggleDrawer}>
          <ModeCommentIcon />
        </IconButton>
      </Box>
      <Drawer anchor="bottom" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ height: "50vh", padding: "16px" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={toggleDrawer} sx={{ px: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={commentText}
              onChange={handleCommentChange}
            />
            <Button variant="contained" onClick={submitComment}>
              Submit Comment
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            {Array.isArray(comments) && comments.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No comments yet
              </Typography>
            ) : (
              memoizedComments
            )}
          </Box>
        </Box>
        <Box sx={{ padding: "16px" }}>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this comment?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={() => deleteComment(commentToDelete)} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Drawer>
    </>
  );
};

export default CommentsDrawer;
