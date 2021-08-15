import {
  Button,
  CardActionArea,
  Dialog,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { IDX } from "@ceramicstudio/idx";
import { fetch as fetchProfile } from "../api/ProfileRepository";
import { fetchAll as fetchProjects } from "../api/ProjectRepository";

import UserContext from "../context/UserContext";
import { useHistory, useParams } from "react-router-dom";
import { Edit, Group, Language, Loyalty, Add } from "@material-ui/icons";
import ProfileForm from "../components/Project/ProfileForm";
import ProjectForm from "../components/Project/ProjectForm";
import GroupForm from "../components/Project/GroupForm";
import { storeFiles } from "../api/Web3storage";
import { Skeleton } from "@material-ui/lab";
import ProjectCard from "../components/Project/ProjectCard";

const useStyles = makeStyles((theme) => ({
  folderList: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function Profile() {
  const { id } = useParams();
  const [records, setRecords] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [profile, setProfile] = useState({});
  const [profileDialog, setProfileDialog] = useState(false);
  const [projectDialog, setProjectDialog] = useState(false);
  const [groupDialog, setGroupDialog] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { ceramic, idx, desiloContract } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleProfileUpdate = async ({name, description, dropZoneFile}) => {
    let newPictureCid = null;
    if (dropZoneFile.length > 0) {
      newPictureCid = await storeFiles(dropZoneFile);
    }

    const newProfile = {
      name,
      description,
      url: newPictureCid ? "https://ipfs.io/ipfs/" + newPictureCid + "/" + dropZoneFile[0].name : records.url
    }
    
    await idx.set("basicProfile", newProfile);
    setRecords(newProfile);
    setProfileDialog(false);
  };

  const handleProjectCreated = ({createdProjectId}) => {
    setProjectDialog(false)
    /** redirect */
    // history.push("/project/" + createdProjectId);
  }

  const handleGroupCreated = ({createdGroupId}) => {
    setGroupDialog(false)
    /** redirect */
    // history.push("/lab/" + createdGroupId);
  }

  const loadPage = async () => {
    if (idx) {
      try {
        setIsLoading(true);
        const records = await idx.get("basicProfile", id);
        if (records) setRecords(records);
        setProfile(await fetchProfile({ idx, ceramic, desiloContract }, id));
        const projects = await fetchProjects({ idx, ceramic, desiloContract })
        console.log(projects)
        setProjects(projects.filter(project => project.author.some(author => author.did == id)));
        setIsLoading(false);
      } catch (error) {
        console.warn(error);
      }
    }
  };
  useEffect(() => {
    loadPage();
  }, [idx]);

  return (idx &&
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Card>

              <CardMedia 
                
                style={{height: "75px"}}
                image={
                  records.url
                    ? records.url
                    : require("../resources/default-profile-picture.png")
                }
              />
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h3">{records.name}</Typography>
            <Typography variant="subtitle-1">from {records.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Social Credits</Typography>
            <List className={classes.folderList}>
              {isLoading ?
              <>
                <Skeleton animation="wave" width="100%" height={50} />
                <Skeleton animation="wave" width="100%" height={50} />
                <Skeleton animation="wave" width="100%" height={50} />
              </>
              : 
              profile.socialCredits
                ? profile.socialCredits.map((sc, index) =>
                    sc.amountLifetime == 0 ? (
                      ""
                    ) : (
                      <CardActionArea
                        onClick={() => {
                          if (index < profile.socialCredits.length - 1)
                            history.push("/lab/" + sc.id);
                        }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            {index < profile.socialCredits.length - 1 ? (
                              <Group></Group>
                            ) : (
                              <Language></Language>
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            primary={sc.name}
                            secondary={
                              sc.amount +
                              " / " +
                              sc.amountLifetime +
                              " " +
                              sc.token
                            }
                          />
                        </ListItem>
                      </CardActionArea>
                    )
                  )
                : ""}
            </List>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={3}>
          {idx.authenticated && id == idx.id && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setProfileDialog(true)} startIcon={<Edit/>}>
                    Edit my profile
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setProjectDialog(true)} startIcon={<Add/>}>
                    Create a project
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setGroupDialog(true)} startIcon={<Add/>}>
                    Create a lab
                  </Button>
                </Grid>
                {profile.socialCredits && profile.socialCredits[profile.socialCredits.length - 1].amountLifetime == 0 && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        (async () => {
                          await desiloContract.methods.seedSC().send();
                          await loadPage();
                        })();
                      }}
                      startIcon={<Loyalty/>}
                    >
                      Get Starting Credits
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Projects</Typography>
            <Grid container spacing={3}>
            {isLoading ? 
              Array.from(Array(3)).map((_, index) => (
                <Grid item xs={12} key={"skeleton_project_" + index}>
                  <ProjectCard project={null} skeleton />
                </Grid>
              ))
            : projects.map(project => (
              <Grid item xs={12}>
                <ProjectCard project={project}/>
              </Grid>
            ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={profileDialog}
        onClose={async () => {
          setProfileDialog(false);
        }}
        fullWidth
      >
        <ProfileForm
          title="Update profile"
          onSubmit={handleProfileUpdate}
          onClose={() => setProfileDialog(false)}
          defaultName={records.name}
          defaultDescription={records.description}
        />
      </Dialog>
      <Dialog
        open={projectDialog}
        onClose={async () => {
          setProjectDialog(false);
        }}
        fullWidth
      >
        <ProjectForm
          onCreated={handleProjectCreated}
          onClose={() => setProjectDialog(false)}
        />
      </Dialog>
      <Dialog
        open={groupDialog}
        onClose={async () => {
          setGroupDialog(false);
        }}
        fullWidth
      >
        <GroupForm
          onCreated={handleGroupCreated}
          onClose={() => setGroupDialog(false)}
        />
      </Dialog>
    </Grid>
  );
}
