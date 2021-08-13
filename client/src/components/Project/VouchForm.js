import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";

import {
  Card,
  CardHeader,
  Select,
  TextField,
  Button,
  Grid,
  CardActions,
  CardContent,
  MenuItem,
  InputLabel,
  FormControl
} from "@material-ui/core";
import { fetchAll as fetchGroups } from "../../api/GroupRepository";

export default function VouchForm ({onSubmit}) {
  const { ceramic, desiloContract, idx } = useContext(UserContext);
  const [groups, setGroups] = useState([]);
  const [vouchGroupId, setVouchGroupId] = useState("");
  const [vouchGroupAmount, setVouchGroupAmount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const groups = await fetchGroups({ ceramic, desiloContract, idx });
      setGroups(groups);
    };
    if (desiloContract && ceramic && idx) load();
  }, [ceramic, desiloContract, idx]);

  const handleSelectedGroup = (e) => {
    setVouchGroupId(e.target.value);
  }

  const handleAmountChange = (e) => {
    setVouchGroupAmount(parseFloat(e.target.value));
  }

  const handleSubmitClick = (e) => {
    onSubmit({vouchGroupId, vouchGroupAmount});
  }
  
  return (
    <Card>
      <CardHeader
        title="Vouch this project for..."
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: "100%"}}>
              <InputLabel id="group-select-label">Group</InputLabel>
              <Select
                labelId="group-select-label"
                onChange={handleSelectedGroup}
                value={vouchGroupId}
                style={{width: "100%"}}
              >
                {groups.map((group) => 
                  <MenuItem value={group.id} key={"group_" + group.id}>{group.name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Amount to vouch"
              placeholder="Amount to vouch"
              onChange={handleAmountChange}
              value={vouchGroupAmount}
              style={{width: "100%"}}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          onClick={handleSubmitClick}
        >
          Vouch
        </Button>
      </CardActions>
      
      
      
    </Card>
  )
}