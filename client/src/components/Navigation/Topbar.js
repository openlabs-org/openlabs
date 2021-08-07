import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import Groups from '../../views/Groups'
import Feed from '../../views/Feed'
import Profile from '../../views/Profile'
import TopbarLink from './TopbarLink'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 0,
    textAlign: 'left',
    marginRight: '20px'
  },
  spacer: {
    flexGrow: 1
  }
}));

export default function Topbar({onConnect, isConnected}) {
  const classes = useStyles()

  return (
      <Router>
        <div className={classes.root}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Desilo
            </Typography>
            <TopbarLink to="/" exact>Feed</TopbarLink>
            <TopbarLink to="/groups">Groups</TopbarLink>
            <div className={classes.spacer}></div>
            {isConnected ? (
              <div>
                <Button color="primary" onClick={onConnect} variant="contained">Submit</Button>
                <TopbarLink to="/me" icon>
                  <AccountCircle />
                </TopbarLink>
              </div>
              ) : (
                <Button color="inherit" onClick={onConnect} variant="contained">Connect</Button>
            )}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <Feed />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/me">
            <Profile />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}