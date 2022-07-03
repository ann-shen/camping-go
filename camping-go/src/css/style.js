import styled from "styled-components";

export const Label = styled.label`
  font-size: ${(props) => props.fontSize || "20px"};
  margin-left: ${(props) => props.ml || "5px"};
  margin-top: ${(props) => props.mt || "10px"};
  color: ${(props) => props.color || "#797659"};
  text-align: start;
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
  letter-spacing: ${(props) => props.letterSpacing || "0px"};
`;

export const Display = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "flex"};
  justify-content: ${(props) => props.justifyContent || "none"};
  margin: ${(props) => props.m || "0px"};
  margin-left: ${(props) => props.ml || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  align-items: ${(props) => props.alignItems || "center"};
  border-bottom: ${(props) => props.borderBottom || "none"};
  padding-bottom: ${(props) => props.paddingBottom || "0px"};
  text-align: start;
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
  box-shadow: ${(props) => props.boxShadow || "none"};
  background-color: ${(props) => props.bgc || "none"};
`;

export const Img = styled.img`
  margin: ${(props) => props.m || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "auto"};
`;

export const ImgWrap = styled.div`
display: flex;
  align-items: center;
  justify-content: center;
  margin: ${(props) => props.m || "0px"};
  margin-bottom: ${(props) => props.mb || "0px"};
  margin-top: ${(props) => props.mt || "0px"};
  width: ${(props) => props.width || "350px"};
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
  border-radius: ${(props) => props.borderRadius || "10px"};
  background-color: ${(props) => props.bgc || "#eae5be"};
  font-size: ${(props) => props.fontSize || "16px"};
  color: ${(props) => props.color || "#797659"};
  border: ${(props) => props.border || "none"};
  cursor: ${(props) => props.cursor || "pointer"};
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
  margin-top: ${(props) => props.mt || "0px"};
  background-color: ${(props) => props.bgc || ""};
  border: ${(props) => props.border || "2px solid #CFC781"};
  font-size: ${(props) => props.fontSize || "15px"};
  color: ${(props) => props.color || "#426765"};
  text-align: center;
  &:hover {
    color: ${(props) => props.color || ""};
    background-color: ${(props) => props.bgc || ""};
  }
`;

export const Cloumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const Hr = styled.hr`
  width: ${(props) => props.width || "60px"};
  border: ${(props) => props.border || " 1px solid #CFC781"};
  margin: ${(props) => props.m || "10px 0px"};
`;

export const BoxWrap = {
  width: "85%",
  height: "auto",
  boxShadow: "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
  borderRadius: 5,
  paddingTop: 8,
  margin: "auto",
  marginBottom: "100px",
  paddingBottom: "50px",
};

export const ProfileBox = {
  width: "85%",
  height: "auto",
  boxShadow: "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
  borderRadius: 6,
  padding: 5,
  margin: "auto",
  marginTop: "30px",
  border: "1px solid #CFC781 ",
  justifyContent: "space-around",
};

export const secondHandSectionByJoinGroup = {
  width: "25%",
  height: "200px",
  boxShadow: "0.3rem 0.3rem 0.6rem #E2E1D3 , -0.3rem -0.3rem 0.7rem #ffffff",
  borderRadius: 6,
  padding: "10px",
  margin: "auto",
  marginTop: "60px",
  border: "1px solid #CFC781 ",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "@media (max-width: 768px)": {
    width: "80%",
  },
  "@media (max-width: 500px)": {
    width: "80%",
    marginTop: "0px",
  },
};

export const suppliesSectionByJoinGroup = {
  width: "100%",
  height: "auto",
  boxShadow: "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
  borderRadius: 10,
  padding: 3,
  paddingLeft: 6,
  alignItems: "center",
  marginTop: 3,
  marginBottom: 5,
};

export const allSecondHandSuppliesByProfile = {
  width: "25%",
  height: "390px",
  boxShadow: "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
  borderRadius: 6,
  padding: "20px",
  marginTop: "60px",
  marginLeft: "30px",
  border: "1px solid #CFC781 ",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",
  "@media (max-width: 1175px)": {
    marginLeft: "40px",
  },
  "@media (max-width: 950px)": {
    width: "38%",
    marginLeft: "20px",
  },
  "@media (max-width: 765px)": {
    width: "80%",
    marginLeft: "3%",
  },
};

export const CardByGroup = {
  width: "80%",
  height: "150px",
  boxShadow: "0.8rem 0.8rem 1.8rem #E2E1D3 , -0.5rem -0.5rem 0.7rem #ffffff",
  borderRadius: 5,
  padding: 1,
  margin: 4,
  marginTop: 15,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F8F8F2",
  border: "1px solid #CFC781 ",
  "@media (max-width: 580px)": {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: "20px",
  },
};
