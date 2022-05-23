import styled from "styled-components";
import { Button, Wrap, Img, Font } from "../../css/style";
import React, { useState, useContext } from "react";
import { TextField, Box } from "@mui/material";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { UserContext } from "../../utils/userContext";

const ImgCursorWrap = styled.div`
  width: 150px;
  height: 120px;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
  border: ${(props) => props.border || "none"};
  margin-bottom: 10px;
`;

const ChoseYourSuppliesToChangeWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  @media (max-width: 900px) {
    justify-content: start;
  }
  @media (max-width: 880px) {
    justify-content: center;
  }
`;

function ShowBuyerSection({
  current_userId,
  buyerArr,
  allSupplies,
  inviteIndex,
}) {
  const [showBuyerSection, setShowBuyerSection] = useState(false);
  const [choseSupplies, setChoseSupplies] = useState("");
  const [buyerIndex, setBuyerIndex] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const Context = useContext(UserContext);

  let buyerId = current_userId;
  let buyerName = Context.userName;

  const choseSuppliesToChange = (e, index) => {
    buyerArr.map((item) => {
      {
        item.border = "none";
      }
    });
    buyerArr[index].border = "3px solid #CFC781";
    setBuyerIndex(index);

    setChoseSupplies(buyerArr[index]);

    allSupplies[inviteIndex].inviteSupplies_index = index;
  };

  const comfirmChange = async () => {
    setAlertOpen(true);
console.log(allSupplies);
    allSupplies[inviteIndex].buyer_name = buyerName;
    allSupplies[inviteIndex].buyer_id = buyerId;
    allSupplies[inviteIndex].change_status = false;
    allSupplies[inviteIndex].change_supplies = choseSupplies.name;
    allSupplies[inviteIndex].change_supplies_picture = choseSupplies.picture;
    allSupplies[inviteIndex].change_note = choseSupplies.note;
    allSupplies[inviteIndex].invite = true;
    const docRef = doc(db, "joinGroup", Context.userId);
    await updateDoc(docRef, { second_hand: allSupplies });

    const getBuyerSupplies = await getDoc(doc(db, "joinGroup", buyerId));
    if (getBuyerSupplies.exists()) {
      let buyerArr = [];
      getBuyerSupplies.data().second_hand.map((item) => {
        if (item.change_status == false) {
          buyerArr.push(item);
        }
      });
      buyerArr[buyerIndex].waiting_reply = true;
      await updateDoc(doc(db, "joinGroup", buyerId), { second_hand: buyerArr });
    }

    Swal.fire({
      position: "center",
      icon: "success",
      title: "已送出邀請",
      showConfirmButton: false,
      timer: 1000,
    });
    setShowBuyerSection(false);
  };
  return (
    <Box
      sx={{
        width: "85%",
        height: "auto",
        boxShadow:
          "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
        borderRadius: 6,
        padding: "20px",
        margin: "auto",
        marginTop: "60px",
        border: "1px solid #CFC781 ",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Font>你目前可以交換的物品</Font>
      <Font fontSize='14px'>點選你想交換的物品吧～</Font>
      <br />
      <ChoseYourSuppliesToChangeWrap>
        {buyerArr.map((item, index) => (
          <Wrap width='180px' direction='column' m='0px 10px 10px 0px'>
            <ImgCursorWrap style={{ border: item.border }}>
              <Img
                width='100%'
                src={item.picture}
                onClick={(e) => {
                  choseSuppliesToChange(e, index);
                }}
              />
            </ImgCursorWrap>
            <Font fontSize='14px' m='10px 0px 0px'>
              {item.name}
            </Font>
          </Wrap>
        ))}
      </ChoseYourSuppliesToChangeWrap>

      <br />
      <Button width='200px' mt='20px' onClick={comfirmChange}>
        確認提出交換邀請
      </Button>
    </Box>
  );
}

export default ShowBuyerSection;
