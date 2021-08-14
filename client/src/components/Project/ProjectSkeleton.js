import React from "react";
import { Skeleton } from "@material-ui/lab";
import { Grid, Card, CardContent } from "@material-ui/core";

export default function ProjectSkeleton () {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={100} />
            <Skeleton animation="wave" height={200}/>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton animation="wave" height={150} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Skeleton animation="wave" height={700}/>
      </Grid>
    </Grid>
  );
}