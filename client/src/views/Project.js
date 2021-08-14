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
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import { Link, useParams } from "react-router-dom";
import { fetch as fetchProject } from "../api/ProjectRepository";
import { fetchAll as fetchProjectEntities } from "../api/EntityRepository";
import { createEntity } from "../api/CeramicService";
import UserContext from "../context/UserContext";
import ProjectEntity from "../components/Project/ProjectEntity";
import VouchForm from "../components/Project/VouchForm";
import EntityForm from "../components/Project/EntityForm";
import { storeFiles, retrieve } from "../api/Web3storage";
import ProjectSkeleton from "../components/Project/ProjectSkeleton";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropZoneOpen, setDropZoneOpen] = useState(false);

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

  const handleMaterialUpload = async ({
    dropZoneDescription,
    dropZoneFile,
  }) => {
    if (dropZoneFile.length > 0) {
      let cid = await storeFiles(dropZoneFile);
      let entityStreamId = await createEntity(
        dropZoneFile[0].name,
        dropZoneDescription,
        cid
      );
      let response = await desiloContract.methods
        .addProjectEntity(id, entityStreamId)
        .send();
      // console.log(response.events.EntityAdded.returnValues.entityId);
    }
    setDropZoneOpen(false);
    loadPage();
  };

  const loadPage = async () => {
    setIsLoading(true);
    const project = await fetchProject(
      { ceramic, desiloContract, idx },
      parseInt(id)
    );
    const entities = await fetchProjectEntities(
      { ceramic, desiloContract, idx, account },
      id
    );
    setProject(project);
    setEntities(entities);
    const isAuthor =
      idx.authenticated &&
      project.author.some((author) => author.did == idx.id);
    setIsAuthor(isAuthor);
    setIsLoading(false);
  };

  useEffect(() => {
    if (desiloContract && idx) loadPage();
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
        <EntityForm
          title="Add material"
          onSubmit={handleMaterialUpload}
          onClose={() => setDropZoneOpen(false)}
        />
      </Dialog>
      {isLoading || !project ? (
        <ProjectSkeleton />
      ) : (
        <Grid container spacing={3}>
          <>
            <Grid item xs={9}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Project</Typography>
                  <Typography variant="h4">{project.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{project.summary}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} justifyContent="space-between">
                    <Grid item>
                      <Typography variant="subtitle1">Materials</Typography>
                    </Grid>
                    <Grid item>
                      {isAuthor && (
                        <Button
                          onClick={() => {
                            setDropZoneOpen(true);
                          }}
                          startIcon={<NoteAddIcon />}
                          variant="outlined"
                        >
                          Add material
                        </Button>
                      )}
                    </Grid>
                    {entities.map((entity, index) => (
                      <Grid item xs={12} key={"entity_" + index}>
                        <ProjectEntity
                          entity={entity}
                          editable={isAuthor}
                          onUpdate={loadPage}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={3}>
              <Grid container spacing={3}>
                {idx.authenticated ? (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVouchClick}
                        fullWidth
                      >
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
        </Grid>
      )}
    </Container>
  );
}
