import React, { useState, useEffect } from "react";
import desilo from "./contracts/desilo.json";
import dSocialCreditsContract from "./contracts/dSocialCredits.json";

import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  
  const [web3, setWeb3] = useState(null); 
  const [account, setAccount] = useState(null); 
  const [desiloContract, setDesiloContract] = useState(null); 
  const [socialCreditsContract, setSocialCreditsContract] = useState(null); 

  useEffect(()=> {
    (async ()=>{
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        const account = (await web3.eth.getAccounts())[0];
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        const desiloContract = new web3.eth.Contract(
          desilo.abi,
          desilo.networks[networkId] && desilo.networks[networkId].address,
        );

        const socialCreditsContract = new web3.eth.Contract(
          dSocialCreditsContract.abi,
          dSocialCreditsContract.networks[networkId] && dSocialCreditsContract.networks[networkId].address,
        );
  
        // Set web3, accounts, and contract to the state
        setWeb3(web3);
        setAccount(account);
        setDesiloContract(desiloContract);
        setSocialCreditsContract(socialCreditsContract);

        
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })();
  }, []);


    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
      </div>
    );
  
}

export default App;