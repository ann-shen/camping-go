import styleFunctionSx from "@mui/system/styleFunctionSx";
import styled from "styled-components";

export const Label = styled.label`
  font-size: ${(props) => props.fontSize || "20px"};
  margin-left: ${(props) => props.ml || "5px"};
  margin-top: ${(props) => props.mt || "10px"};

  color: ${(props) => props.color || "#797659"};
`;
export const Input = styled.input`
  font-size: 16px;
  width: 90px;
  height: 25px;
  margin: 20px;
  border-radius: 5px;
  border: 1px solid gray;
`;
export const AddButton = styled.button`
  width: 150px;
`;

export const Font = styled.p`
  font-size: ${(props) => props.fontSize || "20px"};
  margin: ${(props) => props.margin || "0px"};
  margin-left: ${(props) => props.marginLeft || "0px"};
  color: ${(props) => props.color || "#797659"};
`;

export const Display = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "flex"};
  justify-content: ${(props) => props.justifyContent || "none"};
  margin-left: ${(props) => props.ml || "0px"};
  align-items: center;
  border-bottom: ${(props) => props.borderBottom || "none"};
  padding-bottom: ${(props) => props.paddingBottom || "0px"};
`;

export const Img = styled.img`
  margin: 10px 0px 10px 0px;
  margin-bottom: ${(props) => props.mb || "0px"};
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "auto"};
`;

export const Button = styled.button`
  margin-top: ${(props) => props.mt || "50px"};
  margin-left: ${(props) => props.ml || "0px"};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border-radius: ${(props) => props.borderRadius || "40px"};
  background-color: ${(props) => props.bgc || "#eae5be"};
  font-size: ${(props) => props.fontSize || "20px"};
  color: ${(props) => props.color || "#797659"};
`;
