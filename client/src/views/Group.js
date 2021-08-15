import React, { useState, useEffect, useContext } from "react";

import {
  Container,
  Typography,
  Grid,
  TextField,
  Tabs,
  Tab,
  Box,
  Paper,
  LinearProgress,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { fetchAll, fetchDetailed } from "../api/GroupRepository";
import ProjectCard from "../components/Project/ProjectCard";

import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { GroupWork } from "@material-ui/icons";

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
      let newResults;
      if (cache) {
        newResults = { ...cache };
      } else {
        setIsLoading(true);
        newResults = await fetchDetailed(
          { desiloContract, ceramic, idx },
          parseInt(id)
        );
        setCache(newResults);
      }

      if (search.length) {
        newResults.pending = results.pending.filter((item) =>
          item.title.toLowerCase().match(search)
        );
        newResults.affiliated = results.affiliated.filter((item) =>
          item.title.toLowerCase().match(search)
        );
      }
      setResults(newResults);
      console.log(newResults);
      setIsLoading(false);
    };
    if (desiloContract && idx) load();
  }, [search, idx, desiloContract]);

  const styles = useStyles();

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        {isLoading ? (
          <>
            <Grid item xs={12}>
              <Skeleton animation="wave" height={30} width="15%" />
              <Skeleton animation="wave" height={50} width="50%" />
              <Skeleton animation="wave" height={100} width="70%" />
            </Grid>
            <Grid item xs={12}>
              <Skeleton animation="wave" height={50} width="50%" />
            </Grid>
            <Grid item xs={12}>
              <Skeleton animation="wave" height={200} width="100%" />
            </Grid>
          </>
        ) : (
          results && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Lab</Typography>
                <Typography variant="h3">{results.name}</Typography>
                <Typography variant="h5">{results.description}</Typography>
                <Grid style={{ width: "100%", height: 25 }}></Grid>
                <Typography variant="h7" style={{ color: "gray" }}>
                  {"Acceptance: " +
                    results.acceptance +
                    " " +
                    results.token +
                    ", " +
                    "Yield: " +
                    (results.yield / 2 ** 64) * 100 +
                    "%"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={9}>
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
                    <Tab label="Governance" {...a11yProps(2)} disabled />
                  </Tabs>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Search"
                  placeholder="Search..."
                  variant="filled"
                  onChange={handleSearch}
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </>
          )
        )}
      </Grid>
    </Container>
  );
};
