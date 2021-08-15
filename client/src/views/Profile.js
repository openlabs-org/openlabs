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
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { IDX } from "@ceramicstudio/idx";
import { fetch as fetchProfile } from "../api/ProfileRepository";

import UserContext from "../context/UserContext";
import { useHistory, useParams } from "react-router-dom";
import { Edit, Group, Language } from "@material-ui/icons";
import EntityForm from "../components/Project/EntityForm";
import { storeFiles } from "../api/Web3storage";

const useStyles = makeStyles((theme) => ({
  folderList: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  splitScreen: {
    display: "flex",
    flexDirection: "row",
  },
  leftPane: {
    width: "50%",
  },
  rightPane: {
    width: "50%",
  },
}));

export default function Profile() {
  const { id } = useParams();
  const [records, setRecords] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [profile, setProfile] = useState({});
  const [dropZoneOpen, setDropZoneOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { ceramic, idx, desiloContract } = useContext(UserContext);

  const updateRecords = async () => {
    console.log(records);
    await idx.set("basicProfile", records);
    console.log(await idx.get("basicProfile"));
  };

  const handleMaterialUpload = async ({
    dropZoneDescription,
    dropZoneFile,
  }) => {
    if (dropZoneFile.length > 0) {
      let cid = await storeFiles(dropZoneFile);
      setRecords({
        ...records,
        url: "https://ipfs.io/ipfs/" + cid + "/" + dropZoneFile[0].name,
      });
      await updateRecords();
      // console.log(response.events.EntityAdded.returnValues.entityId);
    }
    setDropZoneOpen(false);
  };

  const loadPage = async () => {
    if (idx) {
      try {
        const records = await idx.get("basicProfile", id);
        if (records) setRecords(records);
        setProfile(await fetchProfile({ idx, ceramic, desiloContract }, id));
      } catch (error) {
        console.warn(error);
      }
    }
  };
  useEffect(() => {
    loadPage();
  }, [idx]);

  return (
    <div>
      <Dialog
        open={dropZoneOpen}
        onClose={async () => {
          setDropZoneOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <EntityForm
          title="Add material"
          onSubmit={handleMaterialUpload}
          onClose={() => setDropZoneOpen(false)}
        />
      </Dialog>
      <div className={classes.splitScreen}>
        <div className={classes.leftPane}>
          <h1>Profile</h1>
          {idx ? (
            <FormControl>
              <img
                src={
                  records.url
                    ? records.url
                    : require("../resources/default-profile-picture.png")
                }
                style={{ borderRadius: "50%", width: 300, height: 300 }}
              ></img>
              {idx.authenticated && id == idx.id ? (
                <IconButton onClick={() => setDropZoneOpen(true)}>
                  <Edit></Edit>
                </IconButton>
              ) : (
                ""
              )}
              <TextField
                variant="outlined"
                placeholder="enter name..."
                onChange={(e) =>
                  setRecords({ ...records, name: e.target.value })
                }
                value={records.name}
                disabled={!idx.authenticated || id != idx.id}
              ></TextField>
              <TextField
                variant="outlined"
                placeholder="enter affiliation..."
                onChange={(e) =>
                  setRecords({ ...records, description: e.target.value })
                }
                value={records.description}
                disabled={!idx.authenticated || id != idx.id}
              ></TextField>
              {idx.authenticated && id == idx.id ? (
                <Button variant="outlined" onClick={updateRecords}>
                  Update
                </Button>
              ) : (
                ""
              )}
              {idx.authenticated &&
              id == idx.id &&
              profile.socialCredits &&
              profile.socialCredits[profile.socialCredits.length - 1]
                .amountLifetime == 0 ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    (async () => {
                      await desiloContract.methods.seedSC().send();
                      await loadPage();
                    })();
                  }}
                >
                  Get Starting Credits
                </Button>
              ) : (
                ""
              )}
            </FormControl>
          ) : (
            ""
          )}
        </div>
        <div className={classes.rightPane}>
          <h1>Social Credits</h1>
          <List className={classes.folderList}>
            {profile.socialCredits
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
        </div>
      </div>
    </div>
  );
}
