import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  }
});

export default ({ group }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {group.name}
        </Typography>
        <Typography variant="body2" component="p">
          {group.description}
        </Typography>
      </CardContent>
    </Card>
  )
}