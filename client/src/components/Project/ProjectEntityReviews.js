import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button, TextField, Grid } from "@material-ui/core";
import UserContext from "../../context/UserContext";

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

export default function ProjectEntityReviews({
  reviews,
  onReview,
  onSubmitReview,
  onUnstake
}) {
  const classes = useStyles();
  const { account } = useContext(UserContext);
  const [reviewContent, setReviewContent] = useState({});

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
              <strong>{review.author.name}</strong> added a review{" "}
              {review.publishedAt}
            </Typography>
            <Paper elevation={0} className={classes.paper}>
              <Typography>{review.texts}</Typography>
            </Paper>
            {review.reviewer == account ? <Button onClick={()=>onUnstake(index)} disabled={review.unstake!=1}>{review.unstake==2? "Already Unstaked" : "Unstake"}</Button> : ""}
          </TimelineContent>
        </TimelineItem>
      ))}

      {onReview ? (
        <TimelineItem className={classes.item}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Grid>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setReviewContent({ ...reviewContent, texts: e.target.value });
                }}
              ></TextField>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                onClick={() => onSubmitReview(reviewContent)}
              >
                Submit
              </Button>
            </Grid>
          </TimelineContent>
        </TimelineItem>
      ) : (
        ""
      )}
    </Timeline>
  );
}
