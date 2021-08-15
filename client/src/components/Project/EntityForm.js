import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import CloseIcon from "@material-ui/icons/Close";

export default function EntityForm({
  title = "",
  onSubmit,
  onClose,
  defaultDescription = "",
  hideDescription,
}) {
  const [dropZoneFile, setDropZoneFile] = useState(null);
  const [dropZoneDescription, setDropZoneDescription] =
    useState(defaultDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileDrop = (files) => {
    setDropZoneFile(files);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({ dropZoneDescription, dropZoneFile });
    setIsSubmitting(false);
    setDropZoneFile(null);
    setDropZoneDescription("");
  };

  const handleClose = () => {
    onClose();
    setDropZoneFile(null);
    setDropZoneDescription("");
  };

  return (
    <Card>
      <CardHeader
        avatar={<NoteAddIcon />}
        action={
          <IconButton aria-label="" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        title={title}
      />
      <CardContent>
        <DropzoneArea
          onChange={(files) => fileDrop(files)}
          filesLimit={1}
          showFileNames={true}
          maxFileSize={100000000}
          dropzoneText={"Drag and drop a file here or click (Max 100Mb)"}
        ></DropzoneArea>
      </CardContent>

      {!hideDescription ? (
        <CardContent>
          <TextField
            label="Description"
            placeholder="Describe this file..."
            variant="outlined"
            multiline
            rows={4}
            value={dropZoneDescription}
            onChange={(e) => setDropZoneDescription(e.target.value)}
            style={{ width: "100%" }}
          ></TextField>
        </CardContent>
      ) : (
        ""
      )}

      <CardActions>
        <Button
          onClick={handleSubmit}
          fullWidth
          color="primary"
          variant="contained"
        >
          {isSubmitting && (
            <CircularProgress
              size={20}
              style={{ marginRight: "8px", color: "white" }}
            />
          )}
          Upload
        </Button>
      </CardActions>
    </Card>
  );
}
