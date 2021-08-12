import React, { useState, useEffect, useContext } from "react";
import { Container, Grid, Typography, TextField } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { fetch as fetchProject } from "../api/ProjectRepository";
import { fetchAll as fetchProjectReviews } from "../api/ReviewRepository";
import UserContext from "../context/UserContext";
import ProjectReviews from "../components/Project/ProjectReviews";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null)
  const [reviews, setReviews] = useState([])
  const { ceramic, desiloContract, idx } = useContext(UserContext);

  useEffect(() => {
    const load = async () => {
      const project = await fetchProject({ceramic, desiloContract, idx}, id);
      const reviews = await fetchProjectReviews({ceramic, desiloContract, idx}, id);
      setProject(project);
      setReviews(reviews);
    }
    if (desiloContract && ceramic && idx) load()
  }, [id, ceramic, desiloContract, idx]);
  
  return (
    <Container maxWidth="lg">
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
                <ProjectReviews reviews={reviews}>
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
