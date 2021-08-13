import React, { useState, useEffect, useContext } from "react";

import { Typography, Grid, TextField } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { fetchAll } from "../api/ProjectRepository";
import ProjectCard from "../components/Project/ProjectCard";
import UserContext from "../context/UserContext";

const useStyles = makeStyles({});

export default () => {
  const { desiloContract, ceramic, idx } = useContext(UserContext);
  const styles = useStyles();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState(null);

  const handleSearch = (e) => setSearch(e.target.value);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      let results;
      if (cache) {
        results = cache;
      } else {
        results = await fetchAll({ desiloContract, ceramic, idx });
        setCache(results);
      }

      if (search)
        results = results.filter((item) =>
          item.title.toLowerCase().match(search)
        );
      setProjects(results);
      setIsLoading(false);
    };
    if (ceramic && desiloContract && idx) load();
  }, [search, ceramic, desiloContract, idx]);

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={10}>
        <Typography variant="h3">Research Feed</Typography>
      </Grid>
      <Grid item xs={2}>
        <TextField label="Search" variant="filled" onChange={handleSearch} />
      </Grid>
      {isLoading
        ? Array.from(Array(3)).map((_, index) => (
            <Grid item xs={12} key={"skeleton_project_" + index}>
              <ProjectCard project={null} skeleton />
            </Grid>
          ))
        : projects.map((project) => (
            <Grid item xs={12} key={"project_" + project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
    </Grid>
  );
};
