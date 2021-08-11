import { Button, FormControl, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { IDX } from "@ceramicstudio/idx";
import UserContext from "../context/UserContext";

export default function Profile() {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const { ceramic, idx } = useContext(UserContext);

  const updateName = async () => {
    await idx.set("basicProfile", { name, description: affiliation });
  };

  useEffect(() => {
    (async () => {
      if (idx) {
        try {
          const records = await idx.get("basicProfile", idx.id);
          setName(records.name);
          setAffiliation(records.description);
        } catch {}
      }
    })();
  }, [idx]);

  return (
    <div>
      <h1>My profile</h1>
      <FormControl>
        <TextField
          variant="outlined"
          placeholder="enter name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></TextField>
        <TextField
          variant="outlined"
          placeholder="enter affiliation..."
          onChange={(e) => setAffiliation(e.target.value)}
          value={affiliation}
        ></TextField>
        <Button variant="outlined" onClick={updateName}>
          Update
        </Button>
      </FormControl>
    </div>
  );
}
