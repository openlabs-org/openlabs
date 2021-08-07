import React from "react";
import {
  Link,
  useRouteMatch
} from "react-router-dom";
import { Button } from '@material-ui/core'

export default function TopbarLink({to, exact = true, children}) {
  const matchRoute = useRouteMatch({
    path: to,
    exact
  });

  return (
    <Button component={Link} to={to} color={matchRoute ? 'primary' : 'inherit'}>
      {children}
    </Button>
  )
}