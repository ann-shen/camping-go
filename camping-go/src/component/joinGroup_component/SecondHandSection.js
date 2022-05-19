import { useState, useEffect } from "react";
import {
  Img,
  Cloumn,
  Wrap,
  Hr,
  ImgWrap,
  secondHandSectionByJoinGroup,
  Font,
} from "../../css/style";
import { Box } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

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
    if (second_hand_Arr.length !== 0) {
      second_hand_Arr.map((item) => {
        item.map((obj, index) => {
          if (obj.change_status == true) {
            if (obj.inviteSupplies_index !== "") {
              objArr.push(obj);
            }
          }
        });
        setSucessSecondChange(objArr);
      });
    }
  }, [thisGroupMember]);

  console.log(sucessSecondChange);
  return (
    <>
      {sucessSecondChange && (
        <>
          <Cloumn>
            <Font fontSize='20px' m='50px 0px 0px 0px'>
              二手交換成功組合
            </Font>
            <Hr width='100%'></Hr>
          </Cloumn>
          {sucessSecondChange.map((item, index) => (
            <Wrap width='100%' justifyContent='space-around' key={index}>
              <Box sx={secondHandSectionByJoinGroup}>
                <Font m='0px 0px 20px 0px'>{item.buyer_name}</Font>
                <ImgWrap width='150px' height='100px' mb='10px'>
                  <Img width='100%' src={item.change_supplies_picture}></Img>
                </ImgWrap>
                <Hr width='50%'></Hr>
                <Font color='#426765' fontSize='16px'>
                  {item.change_supplies}
                </Font>
              </Box>

              <CompareArrowsIcon sx={{ fontSize: "50px", color: "#426765" }} />
              <Box sx={secondHandSectionByJoinGroup}>
                <Font m='0px 0px 20px 0px'>{item.seller_name}</Font>
                <ImgWrap width='150px' height='100px' mb='10px'>
                  <Img width='100%' src={item.picture}></Img>
                </ImgWrap>
                <Hr width='50%'></Hr>
                <Font color='#426765' fontSize='16px'>
                  {item.name}
                </Font>
              </Box>
            </Wrap>
          ))}
        </>
      )}
    </>
  );
}

export default SecondHandSection;
