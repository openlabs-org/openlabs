import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  FormControl,
  TextField,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { Publish as PublishIcon } from "@material-ui/icons";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import UserContext from "../context/UserContext";

const globals = require("../global.json");

export default function NewProject() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupToken, setGroupToken] = useState("");
  const { desiloContract, account, ceramic, web3 } = useContext(UserContext);

  const updateEntitySchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "ProjectEntity",
      type: "object",
      properties: {
        title: { type: "string" },
        type: { type: "string" },
        metadata: { type: "string" },
      },
      required: ["title", "type", "metadata"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const schemaInstance = await TileDocument.create(ceramic, schema, metadata);
    console.log("EntitySchema", schemaInstance.commitId.toString());
  };

  const updateProjectSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Project",
      type: "object",
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        entities: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["title", "summary", "entities"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const projectSchema = await TileDocument.create(ceramic, schema, metadata);
    console.log("ProjectSchema", projectSchema.commitId.toString());
  };

  const updateGroupSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Group",
      type: "object",
      properties: {
        token: { type: "string" },
        name: { type: "string" },
      },
      required: ["token", "name"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const groupSchema = await TileDocument.create(ceramic, schema, metadata);
    console.log("GroupSchema", groupSchema.commitId.toString());
  };

  const uploadProject = async () => {
    if (title === "") {
      alert("Please provide title for your project!");
      return;
    }
    // await updateEntitySchema();
    // await updateProjectSchema();
    // await updateGroupSchema();

    // let authorID = ceramic.did.id;
    // let newProject = await TileDocument.create(
    //   ceramic,
    //   { title, summary, entities: [] },
    //   {
    //     controllers: [authorID],
    //     family: "Project",
    //     schema: globals.ceramicSchemas.ProjectSchema,
    //   }
    // );
    // console.log("Project submitted at stream: ", newProject.id.toString());

    // await desiloContract.methods
    //   .registerProject(newProject.id.toString())
    //   .send();
  };

  const createGroup = async () => {
    let groupSetup = await TileDocument.create(
      ceramic,
      {
        name: groupName,
        token: groupToken,
      },
      {
        schema: globals.ceramicSchemas.GroupSchema,
        controllers: [ceramic.did.id],
      }
    );

    let createGroupCall = await desiloContract.methods
      .createGroup(100, groupSetup.id.toString(), 8, 30)
      .send({
        from: account,
      });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h3">New Project</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Title"
            placeholder="Your amazing project title..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            fullWidth
            variant="outlined"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadProject}
            startIcon={<PublishIcon />}
          >
            Upload
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            placeholder="Group name"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
            variant="outlined"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            placeholder="Group token"
            onChange={(e) => setGroupToken(e.target.value)}
            value={groupToken}
            variant="outlined"
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={createGroup} variant="outlined">
            Create Group
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
