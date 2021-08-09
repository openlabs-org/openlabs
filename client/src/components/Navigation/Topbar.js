import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import Groups from "../../views/Groups";
import Feed from "../../views/Feed";
import Profile from "../../views/Profile";
import NewProject from "../../views/NewProject";
import Project from "../../views/Project";
import TopbarLink from "./TopbarLink";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '20px'
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
    marginRight: '8px'
  }
}));

export default function Topbar({ onConnect, isConnected, ceramic }) {
  const classes = useStyles();

  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = () => {
    setIsConnecting(true);
    onConnect();
  };

  const ConnectBtn = isConnecting ? (
    <Button color="inherit" onClick={handleConnect} variant="contained" disabled>
      <CircularProgress size={24} className={classes.spinner} />
      Connecting
    </Button>
  ) : (
    <Button color="inherit" onClick={handleConnect} variant="contained">
      Connect
    </Button>
  )

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" color="transparent" className={classes.root}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Desilo
            </Typography>
            <TopbarLink to="/" exact>
              Feed
            </TopbarLink>
            <TopbarLink to="/groups">Groups</TopbarLink>
            <div className={classes.spacer}></div>
            {isConnected ? (
              <div>
                <Button component={Link} to="/new" color="primary" variant="contained">
                  New Project
                </Button>
                <TopbarLink to="/me" icon>
                  <AccountCircle />
                </TopbarLink>
              </div>
            ) : ConnectBtn}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <Feed ceramic={ceramic}  />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/me">
            <Profile />
          </Route>
          <Route path="/new">
            <NewProject ceramic={ceramic} />
          </Route>
          <Route path="/project/:id">
            <Project ceramic={ceramic} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
