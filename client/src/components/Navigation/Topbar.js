import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, Loyalty } from "@material-ui/icons";
import UserContext from "../../context/UserContext";


import TopbarLink from "./TopbarLink";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "32px",
  },
  title: {
    flexGrow: 0,
    textAlign: "left",
    marginRight: "20px",
  },
  spacer: {
    flexGrow: 1,
  },
  spinner: {
    marginRight: "8px",
  },
}));

export default function Topbar({ onConnect, isConnected }) {
  const classes = useStyles();

  const [isConnecting, setIsConnecting] = useState(false);

  const { idx, username, credits } = useContext(UserContext);
  
  const handleConnect = () => {
    setIsConnecting(true);
    onConnect();
  };

  const ConnectBtn = isConnecting ? (
    <Button
      color="inherit"
      onClick={handleConnect}
      variant="contained"
      disabled
    >
      <CircularProgress size={24} className={classes.spinner} />
      Connecting
    </Button>
  ) : (
    <Button color="primary" onClick={handleConnect} variant="contained">
      Connect
    </Button>
  );

  return (
    <>
      <AppBar position="static" color="transparent" className={classes.root}>
        <Toolbar>
          <img
            src={require("../../resources/openlabs6-03.png")}
            style={{
              width: 198,
              height: 55,
              marginRight: 10,
              marginTop: 5,
              marginBottom: 5,
            }}
          ></img>

          <TopbarLink to="/" exact>
            Feed
          </TopbarLink>
          <TopbarLink to="/labs">Labs</TopbarLink>
          <div className={classes.spacer}></div>
          {isConnected ? (
            <TopbarLink to={"/profile/" + idx.id} icon label={username + ", " + credits + " SC"} variant="outlined">
              <AccountCircle />
            </TopbarLink>
          ) : (
            ConnectBtn
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
