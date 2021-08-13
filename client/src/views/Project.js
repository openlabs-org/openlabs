import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  Select,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GroupIcon from "@material-ui/icons/Group";

import { Link, useParams } from "react-router-dom";
import { fetch as fetchProject } from "../api/ProjectRepository";
import { fetchAll as fetchProjectReviews } from "../api/EntityRepository";
import { fetchAll as fetchGroups } from "../api/GroupRepository";
import UserContext from "../context/UserContext";
import ProjectReviews from "../components/Project/ProjectReviews";

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
            <Grid item xs={12}>
              <Typography variant="h5">Project</Typography>
              <Typography variant="h4">{project.title}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body">{project.summary}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Reviews</Typography>
                  <ProjectReviews entities={entities}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Content"
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </ProjectReviews>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" onClick={onVouch}>
                Vouch
              </Button>
              <Typography variant="h6">Authors</Typography>
              {project.author.map((author) => {
                return (
                  <Tooltip title={author.name}>
                    <Link to={"/profile/" + author.did}>
                      <IconButton>
                        <AccountCircleIcon></AccountCircleIcon>
                      </IconButton>
                    </Link>
                  </Tooltip>
                );
              })}
              <Typography variant="h6">Groups</Typography>
              {project.groups.map((group) => {
                return (
                  <Tooltip title={group.name}>
                    <Link to={"/group/" + group.id}>
                      <IconButton>
                        <GroupIcon></GroupIcon>
                      </IconButton>
                    </Link>
                  </Tooltip>
                );
              })}
              {/* <Typography variant="h6">Participants</Typography> */}
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
