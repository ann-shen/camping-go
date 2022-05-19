import styled from "styled-components";
import React from "react";
import { useState } from "react";
import "../pages/reuite.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Wrap } from "../css/style";
import Swal from "sweetalert2/dist/sweetalert2.js";


const min = 1;
const max = 5;

function FormPropsTextFields({ setTentInfo, setSeat,}) {
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





function Tent({ tentInfo, setTentInfo}) {
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
