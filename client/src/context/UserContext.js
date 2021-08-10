import React from "react";

const UserContext = React.createContext({
  projectListId: null,
  account: null,
  desiloContract: null,
  socialCreditsContract: null,
});

export default UserContext;
