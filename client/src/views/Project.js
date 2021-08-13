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
import { fetchAll as fetchGroups } from "../api/GroupRepository";
import UserContext from "../context/UserContext";
import ProjectEntity from "../components/Project/ProjectEntity";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [vouchGroupId, setVouchGroupId] = useState(0);
  const [vouchGroupAmount, setVouchGroupAmount] = useState(0);
  const [entities, setEntities] = useState([]);
  const { ceramic, desiloContract, idx } = useContext(UserContext);

  const onVouch = async () => {
    let groups = await fetchGroups({ ceramic, desiloContract, idx });
    setGroups(groups);
    setOpen(true);
  };

  const vouchContractCall = async () => {
    let vouch = await desiloContract.methods
      .vouchProject(id, vouchGroupId, vouchGroupAmount)
      .send();
  };

  useEffect(() => {
    const load = async () => {
      const project = await fetchProject(
        { ceramic, desiloContract, idx },
        parseInt(id)
      );
      console.log("found project ", project);
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
      >
        Vouch this project for...
        <Select
          native
          onChange={(e) => {
            setVouchGroupId(e.target.value);
          }}
        >
          {groups.map((group) => (
            <option value={group.id}>{group.name}</option>
          ))}
        </Select>
        <TextField
          placeholder="Amount to vouch"
          onChange={(e) => setVouchGroupAmount(parseFloat(e.target.value))}
        >
          {" "}
        </TextField>
        <Button
          variant="outlined"
          onClick={async () => {
            await vouchContractCall();
            setOpen(false);
          }}
        >
          Vouch
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
            <Divider orientation="vertical" flexItem />
            <Grid item xs={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={onVouch}>
                    Vouch
                  </Button>
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
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Groups</Typography>
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
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
