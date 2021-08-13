import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button, Select } from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  item: {
    "&:before": {
      display: "none",
    },
  },
}));

export default function ProjectReviews({ entities, children, onNewReview }) {
  const classes = useStyles();

  return (
    <Timeline align="left">
      {entities &&
        entities.map((entity) => (
          <TimelineItem className={classes.item}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="textSecondary">
                <strong>
                  {entity.content[entity.content.length - 1].name}
                </strong>
                <Timeline align="left">
                  {entity.reviews.map((review) => (
                    <TimelineItem className={classes.item}>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent></TimelineContent>
                      <Typography color="textSecondary">
                        <strong>{review.author}</strong> added a review{" "}
                        {review.publishedAt}
                      </Typography>
                      <Paper elevation={3} className={classes.paper}>
                        <Typography>{review.content}</Typography>
                      </Paper>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      {children && (
        <TimelineItem className={classes.item}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Button color="primary" variant="contained" onClick={onNewReview}>
              Write a review
            </Button>
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  );
}
