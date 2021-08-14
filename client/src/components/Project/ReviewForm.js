import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardActions, TextField, Button, IconButton, CircularProgress } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";

export default function EntityForm ({title = "", onSubmit, onClose, defaultContent = ""}) {
  const [reviewContent, setReviewContent] = useState(defaultContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({reviewContent});
    setIsSubmitting(false);
    setReviewContent(defaultContent);
  };

  const handleClose = () => {
    onClose();
    setReviewContent(defaultContent);
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <EditIcon />
        }
        action={
          <IconButton aria-label="" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        title={title}
      />
      <CardContent>
      <TextField
        multiline
        rows={4}
        variant="outlined"
        style={{ width: "100%" }}
        value={reviewContent}
        label="Content"
        placeholder="Type your arguments here..."
        onChange={(e) => setReviewContent(e.target.value)}
      ></TextField>
      </CardContent>
      <CardActions>
        <Button onClick={handleSubmit} fullWidth color="primary" variant="contained">
          {isSubmitting && <CircularProgress size={20} style={{marginRight: "8px", color: "white"}} />}
          Submit
        </Button>
      </CardActions>
      
    </Card>
  )
}