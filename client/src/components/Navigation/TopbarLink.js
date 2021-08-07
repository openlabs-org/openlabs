import React from "react";
import {
  Link,
  useRouteMatch
} from "react-router-dom";
import { Button, IconButton } from '@material-ui/core'

export default function TopbarLink({to, exact = true, icon = false, children}) {
  const matchRoute = useRouteMatch({
    path: to,
    exact
  });

  return (icon ?
    <IconButton component={Link} to={to} color={matchRoute ? 'primary' : 'inherit'}>
      {children}
    </IconButton> :
    <Button component={Link} to={to} color={matchRoute ? 'primary' : 'inherit'}>
      {children}
    </Button>
  )
}