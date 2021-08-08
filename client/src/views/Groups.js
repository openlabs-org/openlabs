import React, { useState, useEffect } from 'react';

import { Container, Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { fetchAll } from '../api/GroupRepository';
import GroupCard from '../components/Group/GroupCard';

const useStyles = makeStyles({
  root: {
    marginTop: '20px',
  },
});

export default () => {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => setSearch(e.target.value);

  useEffect(() => { 
    const load = async () => {
      let results = await fetchAll();
      if (search) results = results.filter(item => item.name.match(search));
      setGroups(results)
    };
    load();
  }, [search]);

  const styles = useStyles();
  
  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">Groups List</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Search" variant="filled" onChange={handleSearch}/>
        </Grid>
      {groups.map(group => (
        <Grid item xs={12} key={'group_' + group.id}>
          <GroupCard group={group} />
        </Grid>
      ))}
      </Grid>
    </Container>
  );
}