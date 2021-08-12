import React, { useState, useEffect } from "react";
import desilo from "./contracts/desilo.json";
import dSocialCreditsContract from "./contracts/dSocialCredits.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import Topbar from "./components/Navigation/Topbar";
import UserContext from "./context/UserContext";
import { ceramic, threeIdAuthenticate } from './api/CeramicService';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [idx, setIDX] = useState(null);
  const [account, setAccount] = useState(null);
  const [desiloContract, setDesiloContract] = useState(null);
  const [socialCreditsContract, setSocialCreditsContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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
      }}
    >
      <div className="App">
        <Topbar onConnect={onConnect} isConnected={isConnected} />
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
