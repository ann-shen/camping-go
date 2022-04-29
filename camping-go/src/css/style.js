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
  margin: ${(props) => props.m || "0px"};
  margin-left: ${(props) => props.marginLeft || "0px"};
  color: ${(props) => props.color || "#797659"};
`;

export const Display = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "flex"};
  justify-content: ${(props) => props.justifyContent || "none"};
  margin-left: ${(props) => props.ml || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  align-items: ${(props) => props.alignItems || "center"};
  border-bottom: ${(props) => props.borderBottom || "none"};
  padding-bottom: ${(props) => props.paddingBottom || "0px"};
  /* height: ${(props) => props.height || "200px"}; */
`;

export const Wrap = styled.div`
  width: ${(props) => props.width || "0px"};
  height: ${(props) => props.height || "auto"};
  display: flex;
  flex-direction: ${(props) => props.direction || "flex"};
  justify-content: ${(props) => props.justifyContent || "none"};
  margin: ${(props) => props.m || "0px"};
  align-items: ${(props) => props.alignItems || "center"};
  border-bottom: ${(props) => props.borderBottom || "none"};
  padding-bottom: ${(props) => props.paddingBottom || "0px"};
  box-shadow: ${(props) =>
    props.boxShadow ||
    "0.8rem 0.8rem 3.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff"};
  background-color: ${(props) => props.bgc || "none"};
`;

export const Img = styled.img`
  margin: ${(props) => props.m || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "auto"};
`;

export const ImgWrap = styled.div`
align-items: center;
justify-content: center;
  margin: ${(props) => props.m || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  width: ${(props) => props.width || "300px"};
  height: ${(props) => props.height || "200px"};
  border-radius: 20px;
  overflow: hidden;
`;



export const Button = styled.button`
  &:hover {
    color: #ffffff;
    background-color: #dcd8b3;
    box-shadow: none;
  }
  &:active {
    color: #797659;
    background-color: #eae5be;
    box-shadow: inset 0.2rem 0.2rem 1rem #bdb991,
      inset -0.2rem -0.2rem 1rem #fffef4;
  }
  margin-top: ${(props) => props.mt || "0px"};
  margin-left: ${(props) => props.ml || "0px"};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border-radius: ${(props) => props.borderRadius || "15px"};
  background-color: ${(props) => props.bgc || "#eae5be"};
  font-size: ${(props) => props.fontSize || "16px"};
  color: ${(props) => props.color || "#797659"};
  border: ${(props) => props.mt || "none"};
  /* box-shadow: ${(props) =>
    props.boxShadow ||
    "inset 0.2rem 0.2rem 1rem #FFFEF4, inset -0.2rem -0.2rem 1rem #DCD8B3, 0.2rem 0.2rem 0.6rem #D7D2AE, -0.2rem -0.2rem 0.5rem #ffffff"}; */
  padding: 5px;
  letter-spacing: 2px;
`;

export const Tag = styled.div`
  width: ${(props) => props.width || "60px"};
  height: ${(props) => props.height || "20px"};
  border-radius: ${(props) => props.borderRadius || "12px"};
  padding: ${(props) => props.p || "3px"};
  margin: ${(props) => props.m || "0px"};
  background-color: ${(props) => props.bgc || ""};
  border: ${(props) => props.border || "2px solid #CFC781"};
  margin: ${(props) => props.m || "0px"};
  font-size: ${(props) => props.fontSize || "15px"};
  color: ${(props) => props.color || "#426765"};
`;

export const Cloumn = styled.div`
display:flex;
flex-direction:column;
align-items:start;`