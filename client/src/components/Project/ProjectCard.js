import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  subtitle: {
    fontSize: 14,
  }
});

export default ({ project }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.subtitle} color="textSecondary" gutterBottom>
          {project.author}, {project.createdAt}
        </Typography>
        <Typography variant="h5" component="h2">
          {project.title}
        </Typography>
        <Typography variant="body2" component="p">
          {project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        { project.groups.map(group => <Button size="small" key={'group_' + group.id}>{group.name}</Button>)}
      </CardActions>
    </Card>
  )
}