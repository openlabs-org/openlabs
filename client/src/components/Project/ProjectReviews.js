import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Button } from '@material-ui/core';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  item: {
    "&:before": {
      display: "none"
    }
  }
}));

export default function ProjectReviews({reviews, children, onNewReview}) {
  const classes = useStyles();

  return (
    <Timeline align="left">
    {reviews.map(review => 
      <TimelineItem className={classes.item}>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography color="textSecondary">
            <strong>{review.author}</strong> added a review {review.publishedAt}
          </Typography>
          <Paper elevation={3} className={classes.paper}>
            <Typography>{review.content}</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    )}
    {children && 
      <TimelineItem className={classes.item}>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Button
            color="primary"
            variant="contained"
            onClick={onNewReview}
          >
            Write a review
          </Button>
        </TimelineContent>
      </TimelineItem>
    }
    </Timeline>
  );
}
