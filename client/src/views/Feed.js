import React, { useState, useEffect } from "react";

import { Container, Typography, Grid, TextField, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll } from "../api/ProjectRepository";
import ProjectCard from "../components/Project/ProjectCard";

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
});

export default ({ ceramic }) => {
  const styles = useStyles();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => setSearch(e.target.value);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      let results = await fetchAll(ceramic);
      if (search) results = results.filter((item) => item.title.toLowerCase().match(search));
      setProjects(results);
      setIsLoading(false)
    };
    if (ceramic) load();
  }, [search, ceramic]);

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">Research Feed</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Search" variant="filled" onChange={handleSearch} />
        </Grid>
        {isLoading ? 
          <Grid item xs={12}>
            <CircularProgress size={300} />
          </Grid>
        : projects.map((project) => (
          <Grid item xs={12} key={"project_" + project.id} >
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
