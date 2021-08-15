import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import UserContext from "../../context/UserContext";

const globals = require("../../global.json");

export default function NewProject({onCreated, onClose}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { desiloContract, account, ceramic } = useContext(UserContext);


  const uploadProject = async () => {
    if (title === "") {
      alert("Please provide title for your project!");
      return;
    }
    
    setIsSubmitting(true);
    let authorID = ceramic.did.id;
    let newProject = await TileDocument.create(
      ceramic,
      { title, summary, entities: [] },
      {
        controllers: [authorID],
        family: "Project",
        schema: globals.ceramicSchemas.ProjectSchema,
      }
    );
    console.log("Project submitted at stream: ", newProject.id.toString());

    await desiloContract.methods
      .registerProject(newProject.id.toString())
      .send();

    setIsSubmitting(false);
    onCreated({createdProjectId: 0});
  };

  return (
    <Card>
      <CardHeader
        title="New Project"
        action={
          <IconButton aria-label="" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        <TextField
          label="Title"
          placeholder="Your amazing project title..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          fullWidth
          variant="outlined"
        ></TextField>
      </CardContent>
      <CardContent>
        <TextField
          label="Summary"
          placeholder="Your amazing project summary..."
          onChange={(e) => setSummary(e.target.value)}
          multiline
          rows={5}
          value={summary}
          fullWidth
          variant="outlined"
        ></TextField>
      </CardContent>
      <CardActions>
        <Button
          onClick={uploadProject}
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
          Create
        </Button>
      </CardActions>
    </Card>
  );
}
