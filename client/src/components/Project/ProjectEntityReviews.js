import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button } from "@material-ui/core";
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

export default function ProjectEntityReviews({ reviews, onNewReview }) {
  const classes = useStyles();

  return (
    <Timeline align="left">
      {reviews.map((review, index) => (
        <TimelineItem className={classes.item} key={"review_" + index}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
          <Typography color="textSecondary">
            <strong>{review.author}</strong> added a review {review.publishedAt}
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <Typography>{review.content}</Typography>
          </Paper>
          </TimelineContent>
          
          
        </TimelineItem>
      ))}
    </Timeline>
  );
}
