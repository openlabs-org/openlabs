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

export default function ProfileForm({
  title = "",
  onSubmit,
  onClose,
  defaultName,
  defaultDescription
}) {
  const [dropZoneFile, setDropZoneFile] = useState(null);
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileDrop = (files) => {
    setDropZoneFile(files);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({ name, description, dropZoneFile });
    setIsSubmitting(false);
    setDropZoneFile(null);
    setName(defaultName);
    setDescription(defaultDescription);
  };

  const handleClose = () => {
    onClose();
    setDropZoneFile(null);
    setName(defaultName);
    setDescription(defaultDescription);
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
          dropzoneText={"Drag and drop your profile picture here"}
        ></DropzoneArea>
      </CardContent>

      <CardContent>
        <TextField
          label="Name"
          placeholder="Type your username here..."
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%" }}
        ></TextField>
      </CardContent>
      
      <CardContent>
        <TextField
          label="Affiliation"
          placeholder="Type your affiliation here..."
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%" }}
        ></TextField>
      </CardContent>

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
          Confirm
        </Button>
      </CardActions>
    </Card>
  );
}
