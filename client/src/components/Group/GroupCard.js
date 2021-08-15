import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, CardActionArea } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  }
});

export default ({ group }) => {
  const classes = useStyles();
  const history = useHistory();

  const goToGroup = () => history.push("/lab/" + group.id);

  return (
    <Card className={classes.root} variant="outlined" onClick={goToGroup}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h5" component="h2">
            {group.name}
          </Typography>
          <Typography variant="body2" component="p">
            {group.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}