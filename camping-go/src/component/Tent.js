import styled from "styled-components";
import React from "react";
import { useState } from "react";
import "../pages/reuite.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Display, Font, Wrap } from "../css/style";
import Swal from "sweetalert2/dist/sweetalert2.js";


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

const min = 1;
const max = 5;

function FormPropsTextFields({ tentInfo, setTentInfo, setSeat, seat }) {
  return (
    <div>
      <Box
        component='form'
        sx={{
          "& .MuiTextField-root": { mt: 1, width: "25ch" },
        }}
        noValidate
        autoComplete='off'>
        <div>
          <TextField
            size='small'
            name='max_number'
            // value={tentInfo.max_number}
            id='standard-number'
            label='帳篷可容納人數'
            type='number'
            helperText='輸入完請按新增帳篷'
            inputProps={{ min, max }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              console.log(e.target.value);
              if (e.target.value === "") {
                return;
              }
              const value = +e.target.value;
              if (value > max) {
                Swal.fire({
                  position: "center",
                  icon: "warning",
                  title: "最大容納數量為5人",
                  showConfirmButton: false,
                  timer: 1500,
                });
                return;
              } else if (value < min) {
                Swal.fire({
                  position: "center",
                  icon: "warning",
                  title: "人數不能為負的唷～",
                  showConfirmButton: false,
                  timer: 1500,
                });
                return;
              } else {
                setTentInfo((prevState) => ({
                  ...prevState,
                  max_number: Number(e.target.value),
                  current_number: 0,
                  seat: Number(e.target.value) - 0,
                }));
                setSeat(e.target.value);
              }
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
                current_number: 0,
                seat: seat - 0,
              }));
            }}
          />
        </div>
      </Box>
    </div>
  );
}

// function Member({ setAllMemberArr, allMemberArr }) {
//   const [memberName, setMemberName] = useState("");

//   const addTentMember = () => {
//     setAllMemberArr((prev) => [...prev, memberName]);
//     setMemberName("");
//   };

//   return (
//     <div>
//       <Input
//         value={memberName}
//         onChange={(e) => {
//           setMemberName(e.target.value);
//         }}
//       />
//       <button onClick={addTentMember}>加入</button>
//       <div>{allMemberArr && allMemberArr.map((item,index) => <div key={index}>{item}</div>)}</div>
//     </div>
//   );
// }

function Tent({ tentInfo, setTentInfo, setAllMemberArr, allMemberArr }) {
  const [seat, setSeat] = useState(0);

  return (
    <div>
      <Wrap
        direction='column'
        m=' 0px 30px 0px 0px'
        width='auto'
        alignItems='start'>
        {/* <Font fontSize='14px' marginLeft='10px'>
          帳篷可容納人數
        </Font> */}
        <FormPropsTextFields
          setTentInfo={setTentInfo}
          tentInfo={tentInfo}
          setSeat={setSeat}
          seat={seat}
        />
      </Wrap>
    </div>
  );
}

export default Tent;
