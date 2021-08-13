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
  Divider
} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import GroupIcon from "@material-ui/icons/Group";

import { Link, useParams } from "react-router-dom";
import { fetch as fetchProject } from "../api/ProjectRepository";
import { fetchAll as fetchProjectReviews } from "../api/EntityRepository";
import UserContext from "../context/UserContext";
import ProjectEntity from "../components/Project/ProjectEntity";
import VouchForm from "../components/Project/VouchForm";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [entities, setEntities] = useState([]);
  const { ceramic, desiloContract, idx } = useContext(UserContext);

  const handleVouchClick = () => {
    setOpen(true);
  };

  const handleVouchSubmit = async ({vouchGroupId, vouchGroupAmount}) => {
    await desiloContract.methods
      .vouchProject(id, vouchGroupId, vouchGroupAmount)
      .send();
    setOpen(false);
  };

  useEffect(() => {
    const load = async () => {
      const project = await fetchProject(
        { ceramic, desiloContract, idx },
        parseInt(id)
      );
      const entities = await fetchProjectReviews(
        { ceramic, desiloContract, idx },
        id
      );
      setProject(project);
      setEntities(entities);
    };
    if (desiloContract && ceramic && idx) load();
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
                  <Typography variant="subtitle1">Papers</Typography>
                  {entities.map((entity, index) => 
                    <ProjectEntity entity={entity} key={"entity_" + index}>
                      {/* <TextField
                        id="outlined-multiline-static"
                        label="Content"
                        multiline
                        rows={4}
                        variant="outlined"
                      /> */}
                    </ProjectEntity>
                  )}
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={handleVouchClick}>
                    Vouch
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Authors</Typography>
                  {project.author.map((author) => 
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
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Labs</Typography>
                  {project.groups.map((group) => 
                    <Chip
                      size="small"
                      icon={<GroupIcon />}
                      label={group.name}
                      clickable
                      color="primary"
                      component={Link}
                      to={"/group/" + group.id}
                      variant="outlined"
                      key={"group_" + group.id}
                    />
                  )}
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
