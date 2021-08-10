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

export default function NewProject({ ceramic }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupToken, setGroupToken] = useState("");
  const { desiloContract, account } = useContext(UserContext);

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

  const updateGroupCuratedSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "GroupCurated",
      type: "object",
      properties: {
        id: { type: "number" },
        token: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "token", "name"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const groupSchema = await TileDocument.create(ceramic, schema, metadata);
    console.log("GroupCuratedSchema", groupSchema.commitId.toString());
  };

  const updateProjectCuratedSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "ProjectCurated",
      type: "object",
      properties: {
        streamId: { type: "string" },
        createdAt: { type: "integer" },
        groups: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["streamId", "createdAt", "groups"],
    };

    const metadata = {
      controllers: [ceramic.did.id],
    };

    const projecCuratedtSchema = await TileDocument.create(
      ceramic,
      schema,
      metadata
    );
    console.log(
      "ProjectCuratedSchema",
      projecCuratedtSchema.commitId.toString()
    );
  };

  const updateBroadcasterSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Broadcaster",
      type: "object",
      properties: {
        projects: {
          type: "array",
          items: {
            type: "string",
          },
        },
        groups: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["projects", "groups"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const projectsListSchema = await TileDocument.create(
      ceramic,
      schema,
      metadata
    );

    console.log("BroadcasterSchema", projectsListSchema.commitId.toString());
  };

  const uploadProject = async () => {
    if (title === "") {
      alert("Please provide title for your project!");
      return;
    }
    // await updateEntitySchema();
    // await updateProjectSchema();
    // await updateProjectCuratedSchema();
    await updateGroupSchema();
    await updateGroupCuratedSchema();
    // await updateBroadcasterSchema();

    // const testA = await TileDocument.create(
    //   ceramic,
    //   { title, summary, groups: ["Group A", "Group B"] },
    //   {
    //     controllers: [ceramic.did.id],
    //     family: "Project",
    //     schema: commitId,
    //   }
    // );

    // console.log(testA.state);

    // const projectsListCommitId =
    //   "k3y52l7qbv1fryc37ed4oei1wi886zf1wvndr4gyymptuunjkvf1v5ynramfrppts";

    // const testA = await TileDocument.create(
    //   ceramic,
    //   { projects: [] },
    //   {
    //     controllers: [ceramic.did.id],
    //     family: "ProjectsList",
    //     schema: globals.ceramicSchemas.projectsListSchema,
    //   }
    // );

    // console.log(testA.id.toString());

    // const projectsListAlpha =
    //   "kjzl6cwe1jw147vpdbx1nnqgdauzaza30bif2e15xflx7achoygcdsg6rqw0ci0";

    // // Client-side
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

    // // Curator-side
    // let curatorID = ceramic.did.id;
    // let curatedProject = await TileDocument.create(
    //   ceramic,
    //   {
    //     streamId: newProject.id.toString(),
    //     createdAt: Date.now(),
    //     groups: [1],
    //   },
    //   {
    //     controllers: [curatorID],
    //     family: "Project",
    //     schema: globals.ceramicSchemas.ProjectCuratedSchema,
    //   }
    // );

    // console.log("Project curated at stream: ", curatedProject.id.toString());

    // const projectListStream = await TileDocument.load(
    //   ceramic,
    //   globals.ceramicSchemas.ProjectsList1
    // );
    // await projectListStream.update({
    //   projects: projectListStream.content.projects.concat([
    //     curatedProject.id.toString(),
    //   ]),
    // });
    // console.log(
    //   (await TileDocument.load(ceramic, globals.ceramicSchemas.ProjectsList1))
    //     .content
    // );
  };

  const createGroup = async () => {
    // Client-side
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
      .createGroup(100, groupSetup.id.toString())
      .send({
        from: account,
      });

    // Broadcaster-side
    let groupCurated = await TileDocument.create(
      ceramic,
      {
        id: createGroupCall.events.GroupCreated.returnValues.id,
        name: groupName,
        token: groupToken,
      },
      {
        schema: globals.ceramicSchemas.GroupCuratedSchema,
        controllers: [ceramic.did.id],
      }
    );
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
          ></TextField>
          <TextField
            placeholder="Group token"
            onChange={(e) => setGroupToken(e.target.value)}
            value={groupToken}
          ></TextField>
          <Button onClick={createGroup}>Create Group</Button>
        </Grid>
      </Grid>
    </Container>
  );
}
