import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { SketchPicker } from "react-color";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import UserContext from "../../context/UserContext";

const globals = require("../../global.json");

export default function NewProject({onCreated, onClose}) {
  const [group, setGroup] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { desiloContract, account, ceramic } = useContext(UserContext);


  const createGroup = async () => {
    setIsSubmitting(true);
    let groupSetup = await TileDocument.create(
      ceramic,
      {
        name: group.name,
        token: group.token,
        color: group.color,
        description: group.description,
      },
      {
        schema: globals.ceramicSchemas.GroupSchema,
        controllers: [ceramic.did.id],
      }
    );

    let createGroupCall = await desiloContract.methods
      .createGroup(100, groupSetup.id.toString(), "0x8" + "0".repeat(15), 30)
      .send({
        from: account,
      });
      console.log(createGroupCall)
    setIsSubmitting(false);
    onCreated({createdGroupId: 0})
  };

  return (
    <Card maxWidth="lg">
      <CardHeader
        title="New Lab"
        action={
          <IconButton aria-label="" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        <TextField
          label="Name"
          placeholder="Name of your lab"
          onChange={(e) => setGroup({ ...group, name: e.target.value })}
          value={group.name}
          variant="outlined"
          style={{width: "100%"}}
        ></TextField>
      </CardContent>
      <CardContent>
        <TextField
          label="Description"
          placeholder="What's your lab about ?"
          onChange={(e) =>
            setGroup({ ...group, description: e.target.value })
          }
          value={group.description}
          variant="outlined"
          style={{width: "100%"}}
        ></TextField>
      </CardContent>
      <CardContent>
        <TextField
          label="Token"
          placeholder="A nice label for your lab token!"
          onChange={(e) => setGroup({ ...group, token: e.target.value })}
          value={group.token}
          variant="outlined"
          inputProps={{ maxLength: 8 }}
          style={{width: "100%"}}
        ></TextField>
      </CardContent>
      <CardContent>
        <SketchPicker
          color={group.color}
          onChangeComplete={(color) =>
            setGroup({ ...group, color: color.hex })
          }
          style={{width: "100%"}}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={createGroup}
          fullWidth
          color="primary"
          variant="contained"
        >
          {isSubmitting && (
            <CircularProgress
              size={20}
              style={{ marginRight: "8px", color: "white" }}
            />
          )}
          Create
        </Button>
      </CardActions>
    </Card>
  );
}
