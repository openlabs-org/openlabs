import React, { useState, useEffect, useContext } from "react";

import { Container, Typography, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll } from "../api/GroupRepository";
import GroupCard from "../components/Group/GroupCard";
import UserContext from "../context/UserContext";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
});

export default () => {
  const { desiloContract, ceramic, idx } = useContext(UserContext);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => setSearch(e.target.value);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      let results = await fetchAll({ desiloContract, ceramic });
      if (search) results = results.filter((item) => item.name.match(search));
      setGroups(results);
      setIsLoading(false);
    };
    if (ceramic && desiloContract) load();
  }, [search, idx, desiloContract]);

  const styles = useStyles();

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">All Labs</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Search" variant="filled" onChange={handleSearch} />
        </Grid>
        {isLoading ?
        Array.from(Array(3)).map((_, index) => (
          <Grid item xs={12} key={"group_loading_" + index}>
            <Skeleton animation="wave" height={150} />
          </Grid>
        )) : 
        groups.map((group) => (
          <Grid item xs={12} key={"group_" + group.id}>
            <GroupCard group={group} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
