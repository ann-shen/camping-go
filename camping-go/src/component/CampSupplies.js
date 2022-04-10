import styled from "styled-components";
import React from "react";

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
function CampSupplies() {
  return (
    <div>
      <Label>要帶的物品</Label>
      <Input></Input>
      <Label>備註</Label>
      <Input></Input>
    </div>
  );
}

export default CampSupplies;
