import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  Select,
  Chip,
  Divider,
} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import GroupIcon from "@material-ui/icons/Group";
import { DropzoneArea } from "material-ui-dropzone";
import { Link, useParams } from "react-router-dom";
import { fetch as fetchProject } from "../api/ProjectRepository";
import { fetchAll as fetchProjectReviews } from "../api/EntityRepository";
import { createEntity, updateEntity } from "../api/CeramicService";
import UserContext from "../context/UserContext";
import ProjectEntity from "../components/Project/ProjectEntity";
import VouchForm from "../components/Project/VouchForm";
import { storeFiles, retrieve } from "../api/Web3storage";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [dropZoneOpen, setDropZoneOpen] = useState(false);
  const [dropZoneFile, setDropZoneFile] = useState(null);
  const [dropZoneAction, setDropZoneAction] = useState("add");
  const [dropZoneDescription, setDropZoneDescription] = useState("");

  const [isAuthor, setIsAuthor] = useState(false);
  const [entities, setEntities] = useState([]);
  const { ceramic, desiloContract, idx, account } = useContext(UserContext);

  const handleVouchClick = () => {
    setOpen(true);
  };

  const handleVouchSubmit = async ({ vouchGroupId, vouchGroupAmount }) => {
    await desiloContract.methods
      .vouchProject(id, vouchGroupId, vouchGroupAmount)
      .send();
    setOpen(false);
  };

  const fileDrop = (files) => {
    console.log(files);
    setDropZoneFile(files);
  };

  const materialUpload = async () => {
    let cid = await storeFiles(dropZoneFile);
    if (dropZoneFile.length > 0) {
      if (dropZoneAction == "add") {
        let entityStreamId = await createEntity(
          dropZoneFile[0].name,
          dropZoneDescription,
          cid
        );
        return await desiloContract.methods
          .addProjectEntity(id, entityStreamId)
          .send();
      } else if (dropZoneAction.includes("update")) {
        console.log(dropZoneAction.substr(7));
        let entityStreamId = await updateEntity(
          dropZoneAction.substr(7),
          dropZoneFile[0].name,
          dropZoneDescription,
          cid
        );
      }

      // console.log(response.events.EntityAdded.returnValues.entityId);
    }
    setDropZoneOpen(false);
    setDropZoneFile(null);
    setDropZoneDescription("");
    // loadPage();
  };

  const loadPage = async () => {
    const project = await fetchProject(
      { ceramic, desiloContract, idx },
      parseInt(id)
    );
    const entities = await fetchProjectReviews(
      { ceramic, desiloContract, idx, account },
      id
    );
    setProject(project);
    setEntities(entities);
    const isAuthor =
      idx.authenticated &&
      project.author.filter((author) => author.did == idx.id).length > 0;
    setIsAuthor(isAuthor);
  };

  useEffect(() => {
    if (desiloContract && ceramic && idx) loadPage();
  }, [id, ceramic, desiloContract, idx]);

  return (
    <Container maxWidth="lg">
      <Dialog
        open={open}
        onClose={async () => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <VouchForm onSubmit={handleVouchSubmit} />
      </Dialog>
      <Dialog
        open={dropZoneOpen}
        onClose={async () => {
          setDropZoneOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DropzoneArea
          onChange={(files) => fileDrop(files)}
          filesLimit={1}
          showFileNames={true}
          maxFileSize={100000000}
          dropzoneText={"Drag and drop a file here or click (Max 100Mb)"}
        ></DropzoneArea>
        <TextField
          placeholder="Describe this file..."
          variant="outlined"
          multiline
          rows={4}
          onChange={(e) => setDropZoneDescription(e.target.value)}
        ></TextField>
        <Button
          onClick={() => {
            materialUpload();
          }}
        >
          Upload
        </Button>
      </Dialog>

      <Grid container spacing={3}>
        {project && (
          <>
            <Grid item xs={9}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">Project</Typography>
                  <Typography variant="h4">{project.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{project.summary}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Materials</Typography>
                  {entities.map((entity, index) => (
                    <ProjectEntity
                      entity={entity}
                      isAuthor={isAuthor}
                      setDropZoneAction={setDropZoneAction}
                      setDropZoneOpen={setDropZoneOpen}
                      key={"entity_" + index}
                    >
                      {/* <TextField
                        id="outlined-multiline-static"
                        label="Content"
                        multiline
                        rows={4}
                        variant="outlined"
                      /> */}
                    </ProjectEntity>
                  ))}
                  {isAuthor ? (
                    <Button
                      onClick={() => {
                        setDropZoneAction("add");
                        setDropZoneOpen(true);
                      }}
                    >
                      Add Material
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={3}>
              <Grid container spacing={3}>
                {idx.authenticated ? (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <Button variant="outlined" onClick={handleVouchClick}>
                        Vouch
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </React.Fragment>
                ) : (
                  ""
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Authors</Typography>
                  {project.author.map((author) => (
                    <Chip
                      size="small"
                      icon={<FaceIcon />}
                      label={author.name}
                      clickable
                      color="primary"
                      component={Link}
                      to={"/profile/" + author.did}
                      variant="outlined"
                      key={"author_" + author.did}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Labs</Typography>
                  {project.groups.map((group) => (
                    <Chip
                      size="small"
                      icon={<GroupIcon />}
                      label={group.name}
                      clickable
                      color="primary"
                      component={Link}
                      to={"/lab/" + group.id}
                      variant="outlined"
                      key={"group_" + group.id}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
