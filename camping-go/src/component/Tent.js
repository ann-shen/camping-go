import styled from "styled-components";
import React from "react";
import { useState, useEffect } from "react";
import {
  DatePicker,
  Uploader,
  DateRangePicker,
  InputGroup,
  InputNumber,
} from "rsuite";
import "../pages/reuite.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const Label = styled.label`
  font-size: 16px;
  margin-left: 30px;
`;

const Input = styled.input`
  font-size: 16px;
  width: 150px;
  height: 30px;
  margin: 20px;
`;

function FormPropsTextFields({ tentInfo, setTentInfo }) {
  return (
    <div>
      <Box
        component='form'
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete='off'>
        <div>
          <TextField
            name='max_number'
            value={Number(tentInfo.max_number)}
            id='standard-number'
            label='Number'
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setTentInfo((prevState) => ({
                ...prevState,
                max_number: e.target.value,
              }));
            }}
          />
        </div>
      </Box>
    </div>
  );
}

function FormPropsTextFieldsStorage({ tentInfo, setTentInfo }) {
  return (
    <div>
      <Box
        component='form'
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete='off'>
        <div>
          <TextField
            name='current_number'
            value={Number(tentInfo.current_number)}
            id='standard-number'
            label='Number'
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setTentInfo((prevState) => ({
                ...prevState,
                current_number: e.target.value,
              }));
            }}
          />
        </div>
      </Box>
    </div>
  );
}

function Tent({ tentInfo, setTentInfo }) {

  return (
    <div>
      <Label>帳篷</Label>
      <br />
      <Label>可容納</Label>
      <FormPropsTextFields setTentInfo={setTentInfo} tentInfo={tentInfo} />

      <Label>已有</Label>
      <FormPropsTextFieldsStorage
        setTentInfo={setTentInfo}
        tentInfo={tentInfo}
      />
      <br />
      <Label>入住團友</Label>
      <Input />
      <button>加入</button>
    </div>
  );
}

export default Tent;
