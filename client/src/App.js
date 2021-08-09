import React, { useState, useEffect } from "react";
import desilo from "./contracts/desilo.json";
import dSocialCreditsContract from "./contracts/dSocialCredits.json";
import getWeb3 from "./getWeb3";

import CeramicClient from "@ceramicnetwork/http-client";
import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import "./App.css";
import Topbar from "./components/Navigation/Topbar";

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com";
const ceramic = new CeramicClient(CERAMIC_API_URL);
const resolver = {
  ...KeyDidResolver.getResolver(),
  ...ThreeIdResolver.getResolver(ceramic),
};
const did = new DID({ resolver });
ceramic.did = did;

const App = () => {
  const [web3, setWeb3] = useState(null);
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
          desilo.networks[networkId] && desilo.networks[networkId].address
        );

        const socialCreditsContract = new web3.eth.Contract(
          dSocialCreditsContract.abi,
          dSocialCreditsContract.networks[networkId] &&
            dSocialCreditsContract.networks[networkId].address
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

  const threeIdAuthenticate = async () => {
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new EthereumAuthProvider(window.ethereum, account);
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    ceramic.did.setProvider(provider);
    await ceramic.did.authenticate();
    setIsConnected(true);
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <Topbar
        onConnect={threeIdAuthenticate}
        isConnected={isConnected}
        ceramic={ceramic}
      />
    </div>
  );
};

export default App;
