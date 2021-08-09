import React from "react";

const UserContext = React.createContext({
  projectListId: null,
  account: null
});

export default UserContext;