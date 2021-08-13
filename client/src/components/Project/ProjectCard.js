import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default ({ project, skeleton = false }) => {
  const classes = useStyles();
  const history = useHistory();

  const goToProject = () => project && history.push("/project/" + project.id);

  return skeleton ? (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </CardContent>
      <CardActions>
        <Skeleton animation="wave" />
      </CardActions>
    </Card>
  ) : (
    <Card className={classes.root} variant="outlined">
      <CardActionArea onClick={goToProject}>
        <CardContent>
          <Typography
            className={classes.subtitle}
            color="textSecondary"
            gutterBottom
          >
            {project.author.map((author) => author.name).join()},{" "}
            {project.createdAt}
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
        {project.groups.map((group) => (
          <Button
            size="small"
            key={"group_" + group.id}
            onClick={() => {
              history.push("/group/" + group.id);
            }}
          >
            {group.name}
          </Button>
        ))}
      </CardActions>
    </Card>
  );
};
