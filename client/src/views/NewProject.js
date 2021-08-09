import { Button, FormControl, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { TileDocument } from "@ceramicnetwork/stream-tile";

const globals = require("../global.json");

export default function NewProject({ ceramic }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

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
    console.log("ProjectSchema", groupSchema.commitId.toString());
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

  const updateProjectsListSchema = async () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "ProjectsList",
      type: "object",
      properties: {
        projects: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["projects"],
    };
    const metadata = {
      controllers: [ceramic.did.id],
    };
    const projectsListSchema = await TileDocument.create(
      ceramic,
      schema,
      metadata
    );

    console.log("ProjectsListSchema", projectsListSchema.commitId.toString());
  };

  const uploadProject = async () => {
    if (title === "") {
      alert("Please provide title for your project!");
      return;
    }
    // await updateEntitySchema();
    // await updateProjectSchema();
    // await updateProjectCuratedSchema();
    // await updateProjectsListSchema();

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

    // Client-side
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

    // Curator-side
    let curatorID = ceramic.did.id;
    let curatedProject = await TileDocument.create(
      ceramic,
      {
        streamId: newProject.id.toString(),
        createdAt: Date.now(),
        groups: [{ id: 1, name: "Group A" }],
      },
      {
        controllers: [curatorID],
        family: "Project",
        schema: globals.ceramicSchemas.ProjectCuratedSchema,
      }
    );

    console.log("Project curated at stream: ", curatedProject.id.toString());

    const projectListStream = await TileDocument.load(
      ceramic,
      globals.ceramicSchemas.ProjectsList1
    );
    await projectListStream.update({
      projects: projectListStream.content.projects.concat([
        curatedProject.id.toString(),
      ]),
    });
    console.log(
      (await TileDocument.load(ceramic, globals.ceramicSchemas.ProjectsList1))
        .content
    );
  };

  return (
    <div>
      <h1>New Project</h1>
      <FormControl>
        <TextField
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></TextField>
        <TextField
          placeholder="Summary"
          onChange={(e) => setSummary(e.target.value)}
          multiline
          maxRows={5}
          value={summary}
        ></TextField>
        <Button variant="outlined" onClick={uploadProject}>
          Upload
        </Button>
      </FormControl>
    </div>
  );
}
