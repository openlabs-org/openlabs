import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Groups from '../../views/Groups'
import Feed from '../../views/Feed'
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

export default function Topbar({onConnect}) {
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
            <Button color="inherit" onClick={onConnect}>Connect</Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <Feed />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}