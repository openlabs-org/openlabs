import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { fetch } from "../api/ProjectRepository";

export default function Project({ ceramic }) {
  const { id } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    const load = async () => {
      const project = await fetch(ceramic, id);
      setProject(project);
    }
    load()
  }, [id, ceramic]);
  
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
      {project && (
        <>
          <Grid item xs={12}>
            <Typography variant="h5">Project</Typography>
            <Typography variant="h4">{project.title}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">Reviews</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Authors</Typography>
            <Typography variant="h6">Groups</Typography>
            <Typography variant="h6">Participants</Typography>
          </Grid>
        </>
      )}
      </Grid>
    </Container>
  );
}
