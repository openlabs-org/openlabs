import React from "react";

const UserContext = React.createContext({
  account: null,
  desiloContract: null,
  socialCreditsContract: null,
  ceramic: null,
  idx: null,
  web3: null
});

export default UserContext;
