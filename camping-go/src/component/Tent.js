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

function Tent() {
  const HandleValue = () => {
    const [value, setValue] = useState(0);
    const handleMinus = () => {
      setValue(parseInt(value, 10) - 1);
    };
    const handlePlus = () => {
      setValue(parseInt(value, 10) + 1);
    };
    console.log(value);
    return (
      <div style={{ width: 160 }}>
        <InputGroup>
          <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
          <InputNumber
            className={"custom-input-number"}
            value={value}
            onChange={setValue}
          />
          <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
        </InputGroup>
      </div>
    );
  };

  return (
    <div>
      <Label>帳篷</Label>
      <br />
      <Label>可容納</Label>
      <HandleValue />

      <Label>已有</Label>
      <HandleValue />
      <br />
      <Label>入住團友</Label>
      <Input />
      <button>加入</button>
    </div>
  );
}

export default Tent;
