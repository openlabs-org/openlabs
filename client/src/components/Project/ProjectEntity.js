import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import UserContext from "../../context/UserContext";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  CloudDownload as DownloadIcon,
  Edit as EditIcon,
  CloudUpload,
} from "@material-ui/icons";
import ProjectEntityReviews from "./ProjectEntityReviews";
import { createReview, updateEntity } from "../../api/CeramicService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  expand: {
    marginLeft: "auto",
  },
  expandIcon: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  versionSelect: {
    minWidth: 80,
    margin: theme.spacing(1),
  },
  actionBtn: {
    margin: theme.spacing(1),
  },
}));

export default function ProjectEntity({
  entity,
  isAuthor,
  setDropZoneAction,
  setDropZoneOpen,
}) {
  const classes = useStyles();
  const entityReviews = entity.reviews;
  const { ceramic, desiloContract, idx } = useContext(UserContext);

  const [expanded, setExpanded] = useState(false);
  const [onReview, setOnReview] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(
    entity.content[entity.content.length - 1]
  );

  console.log(entity);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleDownload = () => {
    /** download file from ipfs ? */
  };

  const handleNewReview = () => {
    /** new review dialog */
    setOnReview(!onReview);
  };

  const handleUnstake = async (reviewId) => {
    await desiloContract.methods.unstake(entity.id, reviewId).send();
    console.log("unstake completed");
  };

  const handleSubmitReview = async (reviewContent) => {
    let commitId = await createReview("standard", reviewContent.texts);
    await desiloContract.methods.stake(entity.id, commitId).send();
    setOnReview(!onReview);
  };

  const handleVersionChange = (e) => {
    setCurrentVersion(e.target.value);
  };

  const handleUploadNewVersion = async () => {
    setDropZoneAction("update " + entity.uri);
    setDropZoneOpen(true);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <FormControl className={classes.versionSelect}>
            <InputLabel id="select-version-label-id">Version</InputLabel>
            <Select
              value={currentVersion}
              onChange={handleVersionChange}
              id="select-version-id"
              labelId="select-version-label-id"
            >
              {entity.content.map((version, index) => (
                <MenuItem value={version} key={"version_" + index}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        title={currentVersion.name}
        subheader={currentVersion.description}
      />
      <CardActions disableSpacing>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<DownloadIcon />}
          variant="outlined"
          onClick={handleDownload}
          className={classes.actionBtn}
          href={
            "https://ipfs.io/ipfs/" +
            currentVersion.uri +
            "/" +
            currentVersion.name
          }
          download=""
        >
          Download
        </Button>

        {isAuthor ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<CloudUpload />}
            variant="outlined"
            className={classes.actionBtn}
            onClick={() => {
              handleUploadNewVersion();
            }}
          >
            Upload New Version
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={handleNewReview}
            className={classes.actionBtn}
          >
            Write a review
          </Button>
        )}
        <Button
          variant="text"
          endIcon={
            <ExpandMoreIcon
              className={clsx(classes.expandIcon, {
                [classes.expandOpen]: expanded,
              })}
            />
          }
          onClick={handleExpand}
          aria-expanded={expanded}
          aria-label="show reviews"
          className={classes.expand}
        >
          See reviews
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <ProjectEntityReviews
            reviews={entityReviews}
            onReview
            onSubmitReview={handleSubmitReview}
            onUnstake={handleUnstake}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
