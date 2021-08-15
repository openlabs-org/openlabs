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
  Dialog,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  CloudDownload as DownloadIcon,
  Edit as EditIcon,
  CloudUpload,
} from "@material-ui/icons";
import ProjectEntityReviews from "./ProjectEntityReviews";
import EntityForm from "./EntityForm";
import ReviewForm from "./ReviewForm";
import { createReview, updateEntity } from "../../api/CeramicService";
import { retrieve, storeFiles } from "../../api/Web3storage";

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

export default function ProjectEntity({ entity, editable, onUpdate }) {
  const classes = useStyles();
  let entityReviews = entity.reviews;
  const { ceramic, desiloContract, idx } = useContext(UserContext);

  const [expanded, setExpanded] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(
    entity.content[entity.content.length - 1]
  );

  console.log(entity);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleNewReview = async ({ reviewContent }) => {
    let commitId = await createReview("standard", reviewContent);
    await desiloContract.methods.stake(entity.id, commitId).send();
    setReviewDialog(false);
    onUpdate();
  };

  const handleVersionChange = (e) => {
    setCurrentVersion(e.target.value);
  };

  const handleMaterialUpdate = async ({
    dropZoneDescription,
    dropZoneFile,
  }) => {
    let cid = await storeFiles(dropZoneFile);
    await updateEntity(
      entity.uri,
      dropZoneFile[0].name,
      dropZoneDescription,
      cid
    );
    onUpdate();
  };

  return (
    <>
      <Dialog
        open={updateDialog}
        onClose={async () => {
          setUpdateDialog(false);
        }}
        fullWidth
      >
        <EntityForm
          title="Update material"
          onSubmit={handleMaterialUpdate}
          onClose={() => setUpdateDialog(false)}
          defaultDescription={currentVersion.description}
        />
      </Dialog>
      <Dialog
        open={reviewDialog}
        onClose={async () => {
          setReviewDialog(false);
        }}
        fullWidth
      >
        <ReviewForm
          title="New review"
          onSubmit={handleNewReview}
          onClose={() => setReviewDialog(false)}
        />
      </Dialog>
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
            className={classes.actionBtn}
            href={
              "https://ipfs.io/ipfs/" +
              currentVersion.uri +
              "/" +
              currentVersion.name
            }
            target="_blank"
          >
            Download
          </Button>

          {editable ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CloudUpload />}
              variant="outlined"
              className={classes.actionBtn}
              onClick={() => setUpdateDialog(true)}
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
              onClick={() => setReviewDialog(true)}
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
              entityReviews={entityReviews}
              editable={editable}
              entityId={entity.id}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
