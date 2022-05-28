import React from "react";
import { Wrap } from "../css/style";
import { TextField } from "@mui/material";


function CampSupplies({ setCampSupplies, campSupplies }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampSupplies((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Wrap
      width='auto'
      direction='column'
      alignItems='start'
      m='10px 30px 0px 0px'>
      <TextField
        sx={{ marginBottom: "30px", marginTop: "5px" }}
        name='supplies'
        label='新增露營用品'
        onChange={handleChange}
        size='small'></TextField>
      <TextField
        name='note'
        label='備註'
        onChange={handleChange}
        size='small'
        helperText='輸入完請按新增物品'
        value={campSupplies.note}></TextField>
    </Wrap>
  );
}

export default CampSupplies;
