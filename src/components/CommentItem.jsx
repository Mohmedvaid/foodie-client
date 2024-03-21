import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import Button from "./AppItems/AppButton";

// Separate style object
const styles = {
  commentBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1, // Add some space between comments
  },
  commentText: {
    margin: 0, // Remove default margins
  },
  actionBox: {
    display: "flex",
    gap: 1, // Space between buttons
  },
};

const CommentItem = React.memo(
  ({ comment, username, onDelete, onStartEdit, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);

    const handleEdit = () => {
      onStartEdit(comment._id); // Call startEditComment from the parent
      setIsEditing(true);
    };

    const handleCancel = () => {
      setEditedText(comment.text); // Reset text to original
      setIsEditing(false);
    };

    const handleSave = () => {
      onUpdate(comment._id, editedText); // Call updateComment from the parent
      setIsEditing(false);
    };

    return (
      <Box sx={styles.commentBox} key={comment._id}>
        {isEditing ? (
          <TextField
            variant="outlined"
            size="small"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            sx={styles.inputField}
          />
        ) : (
          <Typography variant="body1" sx={styles.commentText}>
            {comment.text} - by {comment.user.username}
          </Typography>
        )}

        {comment.user.username === username && (
          <Box sx={styles.actionBox}>
            {isEditing ? (
              <>
                <Button size="small" onClick={handleSave}>
                  Save
                </Button>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="small" onClick={handleEdit}>
                  Edit
                </Button>
                <Button size="small" onClick={() => onDelete(comment._id)}>
                  Delete
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    );
  }
);

export default CommentItem;
