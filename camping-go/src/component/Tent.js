import styled from "styled-components";
import React from "react";
import { useState} from "react";
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

function FormPropsTextFields({ tentInfo, setTentInfo, setSeat }) {
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
            // value={tentInfo.max_number}
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
                max_number: Number(e.target.value),
              }));
              setSeat(e.target.value);
            }}
          />
        </div>
      </Box>
    </div>
  );
}

function FormPropsTextFieldsStorage({ tentInfo, setTentInfo, seat }) {
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
            // value={Number(tentInfo.current_number)}
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
                current_number: Number(e.target.value),
                seat: seat - Number(e.target.value),
              }));
            }}
          />
        </div>
      </Box>
    </div>
  );
}

function Member({ setAllMemberArr, allMemberArr }) {
  const [memberName, setMemberName] = useState("");

  const addTentMember = () => {
    setAllMemberArr((prev) => [...prev, memberName]);
    setMemberName("");
  };

  return (
    <div>
      <Input
        value={memberName}
        onChange={(e) => {
          setMemberName(e.target.value);
        }}
      />
      <button onClick={addTentMember}>加入</button>
      <div>{allMemberArr && allMemberArr.map((item,index) => <div key={index}>{item}</div>)}</div>
    </div>
  );
}

function Tent({ tentInfo, setTentInfo, setAllMemberArr, allMemberArr}) {
  const [seat, setSeat] = useState(0);
  

  return (
    <div>
      <Label>帳篷</Label>
      <br />
      <Label>可容納</Label>
      <FormPropsTextFields
        setTentInfo={setTentInfo}
        tentInfo={tentInfo}
        setSeat={setSeat}
      />
      <Label>已有</Label>
      <FormPropsTextFieldsStorage
        setTentInfo={setTentInfo}
        tentInfo={tentInfo}
        seat={seat}
      />
      <br />
      <Label>入住團友</Label>
      <Member setAllMemberArr={setAllMemberArr} allMemberArr={allMemberArr} />
    </div>
  );
}

export default Tent;
