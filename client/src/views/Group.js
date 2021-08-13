import React, { useState, useEffect, useContext } from "react";

import { Container, Typography, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll, fetchDetailed } from "../api/GroupRepository";
import GroupCard from "../components/Group/GroupCard";
import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
});

export default () => {
  const { desiloContract, ceramic, idx } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      await fetchDetailed({ desiloContract, ceramic, idx }, id);
    };
    load();
  }, [ceramic, desiloContract]);

  const styles = useStyles();

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">Group</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
