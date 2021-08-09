import React, { useState, useEffect } from "react";

import { Container, Typography, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll } from "../api/ProjectRepository";
import ProjectCard from "../components/Project/ProjectCard";

const globals = require("../global.json");

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
});

export default ({ ceramic }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => setSearch(e.target.value);

  useEffect(() => {
    const load = async () => {
      let results = await fetchAll(
        ceramic,
        globals.ceramicSchemas.ProjectsList1
      );
      if (search) results = results.filter((item) => item.title.match(search));
      setProjects(results);
    };
    if (ceramic) load();
  }, [search, ceramic]);

  const styles = useStyles();

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">Research Feed</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Search" variant="filled" onChange={handleSearch} />
        </Grid>
        {projects.map((project) => (
          <Grid item xs={12} key={"project_" + project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
