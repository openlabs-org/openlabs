import React, { useState, useEffect, useContext } from "react";

import {
  Container,
  Typography,
  Grid,
  TextField,
  AppBar,
  Tabs,
  Tab,
  Box,
  Paper,
  LinearProgress,
  Card,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll, fetchDetailed } from "../api/GroupRepository";
import GroupCard from "../components/Group/GroupCard";
import ProjectCard from "../components/Project/ProjectCard";

import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
});

export default () => {
  const { desiloContract, ceramic, idx } = useContext(UserContext);
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [cache, setCache] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSearch = (e) => setSearch(e.target.value);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      let results;
      if (cache) {
        results = cache;
      } else {
        results = await fetchDetailed(
          { desiloContract, ceramic, idx },
          parseInt(id)
        );
        setCache(results);
      }

      if (search) {
        results.pending = results.pending.filter((item) =>
          item.title.toLowerCase().match(search)
        );
        results.affiliated = results.affiliated.filter((item) =>
          item.title.toLowerCase().match(search)
        );
      }
      setResults(results);
      setIsLoading(false);
    };
    if (desiloContract && idx) load();
  }, [search, idx, desiloContract]);

  const styles = useStyles();

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h3">Group</Typography>
        </Grid>
      </Grid>
      {!results ? (
        Array.from(Array(3)).map((_, index) => (
          <Grid item xs={12} key={"skeleton_project_" + index}>
            <ProjectCard project={null} skeleton />
          </Grid>
        ))
      ) : (
        <Grid container spacing={3} alignItems="center">
          <Grid container>
            <Paper square elevation={0}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Affiliated" {...a11yProps(0)} />
                <Tab label="Pending" {...a11yProps(1)} />
                <Tab label="Members" {...a11yProps(2)} />
              </Tabs>
            </Paper>
            <TextField
              label="Search"
              placeholder="Search..."
              variant="standard"
              onChange={handleSearch}
            />
          </Grid>
          <Grid container>
            <TabPanel value={value} index={0} style={{ width: "100%" }}>
              {results.affiliated.map((project) => (
                <Grid item xs={12} key={"project_" + project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1} style={{ width: "100%" }}>
              {results.pending.map((project) => (
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    key={"project_" + project.id}
                    style={{ width: "40%" }}
                  >
                    <ProjectCard project={project} />
                  </Grid>
                  <Grid item xs={12}>
                    <LinearProgress
                      variant="determinate"
                      value={(project.vouches / results.acceptance) * 100}
                    />
                  </Grid>
                </Grid>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2} style={{ width: "100%" }}>
              {/* {results.members.map((user) => (
                <Grid item xs={12} key={"user_" + user.did}>
                  <Card>
                    <CardActionArea>
                      <Grid>{user.name}</Grid>
                      <Grid>{user.description}</Grid>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))} */}
            </TabPanel>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
