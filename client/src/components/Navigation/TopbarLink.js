import React from "react";
import {
  Link,
  useRouteMatch
} from "react-router-dom";
import { Button, IconButton } from '@material-ui/core'

export default function TopbarLink({to, exact = true, icon = false, children, label = "", variant = "text"}) {
  const matchRoute = useRouteMatch({
    path: to,
    exact
  });

  return (
    <Button component={Link} to={to} color={matchRoute ? 'primary' : 'inherit'} startIcon={children} variant={variant}>
      {label}
    </Button>
  )
}