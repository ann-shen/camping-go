import { useState, useEffect } from "react";
import {
  Img,
  Cloumn,
  Hr,
  secondHandSectionByJoinGroup,
  Font,
} from "../../css/style";
import { Box } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import styled from "styled-components";

const SecondHandImgWrap = styled.div`
  width: 150px;
  height: 100px;
  margin-bottom: 10px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const SecondHandSectionWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 500px) {
    flex-direction: column;
    margin: 40px 0px;
    margin-bottom: 70px;
  }
`;

function SecondHandSection({ thisGroupMember }) {
  const [sucessSecondChange, setSucessSecondChange] = useState([]);
  useEffect(() => {
    let second_hand_Arr = [];
    let objArr = [];
    thisGroupMember.map((item) => {
      if (item.second_hand) {
        second_hand_Arr.push(item.second_hand);
      } else {
        return;
      }
    });
    let memberIdArr = [];
    thisGroupMember.forEach((item) => {
      memberIdArr.push(item.info.user_id);
    });
    console.log(memberIdArr);

    if (second_hand_Arr.length !== 0) {
      second_hand_Arr.map((item) => {
        item.map((obj) => {
          if (obj.change_status == true) {
            if (obj.inviteSupplies_index !== "") {
              if (memberIdArr.includes(obj.buyer_id)) {
                objArr.push(obj);
              }
            }
          }
        });
        setSucessSecondChange(objArr);
      });
    }
  }, [thisGroupMember]);

  return (
    <>
      <Cloumn>
        <Font fontSize='20px' m='50px 0px 0px 0px'>
          二手交換成功組合
        </Font>
        <Hr width='100%'></Hr>
      </Cloumn>
      {sucessSecondChange.length !== 0 ? (
        <>
          {sucessSecondChange.map((item, index) => (
            <SecondHandSectionWrap key={index}>
              <Box sx={secondHandSectionByJoinGroup}>
                <Font m='0px 0px 20px 0px'>{item.buyer_name}</Font>
                <SecondHandImgWrap>
                  <Img width='100%' src={item.change_supplies_picture}></Img>
                </SecondHandImgWrap>
                <Hr width='50%'></Hr>
                <Font color='#426765' fontSize='16px'>
                  {item.change_supplies}
                </Font>
              </Box>

              <CompareArrowsIcon sx={{ fontSize: "50px", color: "#426765" }} />
              <Box sx={secondHandSectionByJoinGroup}>
                <Font m='0px 0px 20px 0px'>{item.seller_name}</Font>
                <SecondHandImgWrap>
                  <Img width='100%' src={item.picture}></Img>
                </SecondHandImgWrap>
                <Hr width='50%'></Hr>
                <Font color='#426765' fontSize='16px'>
                  {item.name}
                </Font>
              </Box>
            </SecondHandSectionWrap>
          ))}
        </>
      ) : (
        <Font m='30px 0px 0px 0px' fontSize='16px'>
          快上傳你的二手露營用品跟團員們交換吧！
        </Font>
      )}
    </>
  );
}

export default SecondHandSection;
