import React, { useState, useEffect } from "react";
import desilo from "./contracts/desilo.json";
import dSocialCreditsContract from "./contracts/dSocialCredits.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import Topbar from "./components/Navigation/Topbar";
import UserContext from "./context/UserContext";
import {
  ceramic,
  threeIdAuthenticate,
  defaultAuthenticate,
} from "./api/CeramicService";
import { IDX } from "@ceramicstudio/idx";
import { fetch as fetchProfile } from "./api/ProfileRepository";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";

import Groups from "./views/Groups";
import Group from "./views/Group";
import Feed from "./views/Feed";
import Profile from "./views/Profile";
import NewProject from "./views/NewProject";
import Project from "./views/Project";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [idx, setIDX] = useState(null);
  const [account, setAccount] = useState(null);
  const [desiloContract, setDesiloContract] = useState(null);
  const [socialCreditsContract, setSocialCreditsContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        const account = (await web3.eth.getAccounts())[0];

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        const desiloContract = new web3.eth.Contract(
          desilo.abi,
          desilo.networks[networkId] && desilo.networks[networkId].address,
          { from: account, gasLimit: 1000000 }
        );

        const socialCreditsContract = new web3.eth.Contract(
          dSocialCreditsContract.abi,
          dSocialCreditsContract.networks[networkId] &&
            dSocialCreditsContract.networks[networkId].address,
          { from: account, gasLimit: 1000000 }
        );

        // Set web3, accounts, and contract to the state
        setWeb3(web3);
        setAccount(account);
        setDesiloContract(desiloContract);
        setSocialCreditsContract(socialCreditsContract);

        // Authenticate
        const idx = await defaultAuthenticate();
        setIDX(idx);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);

  const onConnect = async () => {
    const idx = await threeIdAuthenticate(window.ethereum, account);
    const profile = await fetchProfile({ idx, ceramic, desiloContract }, idx.id);
    setUsername(profile.name);
    setCredits(profile.socialCredits.find(credit => credit.token === "SC").amount);
    setIDX(idx);
    setIsConnected(true);
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <UserContext.Provider
      value={{
        account,
        desiloContract,
        socialCreditsContract,
        ceramic,
        idx,
        web3,
        username,
        credits
      }}
    >
      <div className="App">
        <Router>
          <Topbar onConnect={onConnect} isConnected={isConnected} />
          <Container maxWidth="lg">
            {true ? (
              <Switch>
                <Route exact path="/">
                  <Feed />
                </Route>
                <Route path="/labs">
                  <Groups />
                </Route>
                <Route path="/lab/:id">
                  <Group />
                </Route>
                <Route path="/profile/:id">
                  <Profile />
                </Route>
                <Route path="/new">
                  <NewProject />
                </Route>
                <Route path="/project/:id">
                  <Project />
                </Route>
              </Switch>
            ) : (
              <Typography>
                You must be connected to explore <strong>OpenLabs</strong>
              </Typography>
            )}
          </Container>
        </Router>
      </div>
    </UserContext.Provider>
  );
};

export default App;

// //FUNCTIONS TO CALL SMART CONTRACTS. WILL NEED TO SOMEHOW MAKE DESILOCONTRACT A REACHABLE OBJECT.

// /* Parameters: initialSupply: int, uri: string */
// async function createGroup(initialSupply, uri) {
//   console.log("createGroup")
//   return await desiloContract.methods.createGroup(initialSupply, uri).send({
//     from: account,
//   });
// }

// /* Parameters: commitId: string */
// async function getUserSocialCredit(address) {
//   await socialCreditsContract.methods.balanceOf(address, 0).call({
//     from: account
//   }).then(response => {
//     console.log(response);
//     return response;
//   }).catch(error => {
//     console.warn(error);
//   })
// }

// /* Parameters: commitId: int */
// async function stake(commitId) {
//   console.log("stake")
//   return await desiloContract.methods.stake(commitId).send({
//     from: account
//   })
// }

// /* Parameters: commitId: int */
// async function unstake(commitId) {
//   console.log("unstake")
//   return await desiloContract.methods.unstake(commitId).send({
//     from: account
//   });
// }

// // Get all groups a user is associated with
// async function getUserGroups() {
//   let res = [];
//   let groups = await fetchAll();

//   for (let group of groups) {
//     let balance = await socialCreditsContract.methods.balanceOf(account, group.id).call({
//       from: account
//     }).then(response => {
//       console.log(response);
//       return response;
//     }).catch(error => {
//       console.warn(error);
//     });

//     if (balance > 0) {
//       let userGroup = {
//         id: group.id,
//         token: group.name,
//         balance: balance
//       }
//       res.push(userGroup);
//     }
//   }
//   return res;
// }
