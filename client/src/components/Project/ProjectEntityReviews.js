import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  CardActionArea,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import UserContext from "../../context/UserContext";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@material-ui/lab";
import { Receipt, Report } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  item: {
    "&:before": {
      display: "none",
    },
  },

  splitScreen: {
    display: "flex",
    flexDirection: "row",
  },
  leftPane: {
    width: "80%",
  },
  rightPane: {
    width: "20%",
  },

  reportButton: {
    width: 25,
    height: 25,
  },
}));

export default function ProjectEntityReviews({
  entityReviews,
  editable,
  entityId,
}) {
  const classes = useStyles();
  const history = useHistory();
  const { account, desiloContract } = useContext(UserContext);
  const [reviews, setReviews] = useState(entityReviews);

  const [reportVisible, setReportVisible] = useState(false);
  const markAsIrrelevant = async (index, toState) => {
    await desiloContract.methods
      .toggleFraudulent(entityId, index, toState)
      .send();
    const updatedReview = reviews;
    updatedReview[index].fraudulent = toState;
    setReviews(updatedReview);
  };

  const onUnstake = async (index) => {
    await desiloContract.methods.unstake(entityId, index).send();
    const updatedReview = reviews;

    updatedReview[index].unstake = 2;
    setReviews(updatedReview);
  };
  return (
    <Timeline align="left">
      {reviews
        ? reviews.map((review, index) => (
            <TimelineItem
              className={classes.item}
              key={"review_" + index}
              onMouseEnter={() => {
                setReportVisible(true);
              }}
              onMouseLeave={() => setReportVisible(false)}
            >
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className={classes.splitScreen}>
                  <div className={classes.leftPane}>
                    {review.fraudulent ? (
                      <React.Fragment>
                        <Typography color="textSecondary">
                          <strike>
                            <strong>{review.author.name}</strong> added a review{" "}
                            {review.publishedAt}
                          </strike>
                        </Typography>
                        <Paper elevation={0} className={classes.paper}>
                          <Typography>
                            <strike>{review.texts}</strike>
                          </Typography>
                        </Paper>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Typography color="textSecondary">
                          <strong>
                            <a href={"/profile/" + review.author.did}>
                              {review.author.name}
                            </a>
                          </strong>{" "}
                          added a review {review.publishedAt}
                        </Typography>
                        <Paper elevation={0} className={classes.paper}>
                          <Typography>{review.texts}</Typography>
                        </Paper>
                      </React.Fragment>
                    )}

                    {review.reviewer == account ? (
                      <Button
                        onClick={() => onUnstake(index)}
                        disabled={review.unstake != 1}
                        color="primary"
                        startIcon={<Receipt></Receipt>}
                      >
                        {review.unstake == 2 ? "Already Unstaked" : "Unstake"}
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className={classes.rightPane}>
                    {reportVisible && editable ? (
                      <Tooltip title="Mark/Unmark as Irrelevant">
                        <IconButton
                          onClick={() => {
                            markAsIrrelevant(index, !review.fraudulent);
                          }}
                        >
                          <Report className={classes.reportButton}></Report>
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))
        : ""}
    </Timeline>
  );
}
