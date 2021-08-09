import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Button, Typography, CardActionArea } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  const goToProject = () => history.push("/project/" + project.id);

  return (
    <Card className={classes.root} variant="outlined">
      <CardActionArea onClick={goToProject}>
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
      </CardActionArea>
      <CardActions>
        { project.groups.map(group => <Button size="small" key={'group_' + group.id}>{group.name}</Button>)}
      </CardActions>
      
    </Card>
  )
}