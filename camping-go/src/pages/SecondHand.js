import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import {
  Display,
  Cloumn,
  Button,
  Wrap,
  Img,
  Font,
  ImgWrap,
  Hr,
  Tag,
} from "../css/style";
import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import {
  updateDoc,
  doc,
  arrayUnion,
  query,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { Alert, Collapse, IconButton, Skeleton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateLabel = styled.label`
  font-size: 18px;
  margin-left: 20px;
  margin: 5px 0px;
  letter-spacing: 2px;
  color: #605f56;
`;

const FileLabel = styled.label`
  &:hover {
    color: #797659;
    background-color: none;
    box-shadow: none;
  }
  width: 80px;
  height: 20px;
  background-color: none;
  border: 1px solid #605f56;
  border-radius: 10px;
  color: #797659;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 3px 5px 3px;
  margin: 20px 10px;
  display: flex;
  justify-content: center;
`;
const FileInput = styled.input`
  display: none;
  color: rgba(0, 0, 0, 0);
`;

const ImgCursorWrap = styled.div`
  width: 150px;
  height: 120px;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
  border: ${(props) => props.border || "none"};
  margin-bottom: 10px;
`;

const PriviewImg = styled.img`
  width: 100%;
`;

const PriviewImgWrap = styled.div`
  width: 250px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-right: 20px;
`;

const DefaultPriviewImgWrap = styled.div`
  width: 250px;
  height: 180px;
  background-color: #f4f4ef;
  border: 2px dashed #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

function SecondHand({
  userName,
  userId,
  current_userId,
  setSendInvite,
  sendInvite,
}) {
  const [upload, setUpLoadFile] = useState({
    file: "",
    url: "",
  });
  const [suppliesInfo, setSuppliesInfo] = useState({
    name: " ",
    hope: "",
    picture: " ",
    change_status: false,
    buyer_name: "",
    buyer_id: "",
    seller_name: userName,
    seller_id: userId,
    change_supplies: "",
    change_supplies_picture: "",
    change_note: "",
    invite: false,
    inviteSupplies_index: "",
    note: "",
  });
  const [allSupplies, setAllSupplies] = useState([]);
  const [showBuyerSection, setShowBuyerSection] = useState(false);
  const [buyerArr, setBuyerArr] = useState([]);
  const [choseSupplies, setChoseSupplies] = useState("");
  const [inviteIndex, setInviteIndex] = useState("");
  const [imgBorder, setImgBorder] = useState("0px solid transparent");
  const [alertOpen, setAlertOpen] = useState(false);

  let buyerId = current_userId;
  let buyerName = userName;

  console.log(userName);

  // const [secondSuppliesArr, setSecondSuppliesArr] = useState([]);

  const handleFiles = (e) => {
    setUpLoadFile((prevState) => ({ ...prevState, file: e.target.files[0] }));
    console.log(e.target.files[0].name);
  };

  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(doc(db, "joinGroup", userId), (doc) => {
        // console.log("Current data: ", doc.data().second_hand);
        setAllSupplies(doc.data().second_hand);
      });
    }
  }, [userId]);

  useEffect(async () => {
    const storage = getStorage();
    const imageRef = ref(storage, upload.file.name);
    uploadBytes(imageRef, upload.file)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            console.log(url);
            setSuppliesInfo((prevState) => ({
              ...prevState,
              picture: url,
            }));
          })
          .catch((error) => {
            console.log(error.message, "error getting the img url");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [upload]);

  console.log(suppliesInfo.picture);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);

    setSuppliesInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewSecondHandSupplies = async (event) => {
    event.preventDefault();
    console.log(`吼唷！${userId}`);
    console.log(suppliesInfo);
    if (userId) {
      const docRef = doc(db, "joinGroup", userId);
      await updateDoc(docRef, { second_hand: arrayUnion(suppliesInfo) });
    }

    setSuppliesInfo((prevState) => ({
      ...prevState,
      name: "",
      hope: "",
      note: "",
    }));

    setUpLoadFile((prevState) => ({
      ...prevState,
      file: "",
      url: "",
    }));
  };

  const changeInvite = async (index) => {
    const getBuyerSupplies = await getDoc(doc(db, "joinGroup", buyerId));
    if (getBuyerSupplies.exists()) {
      let buyerArr = [];
      getBuyerSupplies.data().second_hand.map((item) => {
        if (item.change_status == false) {
          buyerArr.push(item);
        }
      });
      setBuyerArr(buyerArr);
    }
    setShowBuyerSection(true);
    console.log(showBuyerSection);
    setInviteIndex(index);
  };

  const choseSuppliesToChange = (e, index) => {
    buyerArr.map((item) => {
      {
        item.border = "none";
      }
    });
    buyerArr[index].border = "3px solid #CFC781";
    console.log(buyerArr);

    // setImgBorder("2.5px solid #759D9B");
    setChoseSupplies(buyerArr[index]);
    console.log(index);
    allSupplies[inviteIndex].inviteSupplies_index = index;
  };

  const comfirmChange = async () => {
    setAlertOpen(true);

    allSupplies[inviteIndex].buyer_name = buyerName;
    allSupplies[inviteIndex].buyer_id = buyerId;
    allSupplies[inviteIndex].change_status = false;
    allSupplies[inviteIndex].change_supplies = choseSupplies.name;
    allSupplies[inviteIndex].change_supplies_picture = choseSupplies.picture;
    allSupplies[inviteIndex].change_note = choseSupplies.note;
    allSupplies[inviteIndex].invite = true;
    // console.log(allSupplies[inviteIndex]);
    console.log(allSupplies);
    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: allSupplies });

    setTimeout(() => {
      setAlertOpen(false);
    }, 2000);
  };

  return (
    <>
      <Display>
        {allSupplies && (
          <Display>
            {allSupplies.map((item, index) => (
              <Box
                sx={{
                  width: "85%",
                  height: "390px",
                  boxShadow:
                    "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
                  borderRadius: 6,
                  padding: "20px",
                  margin: "auto",
                  marginTop: "60px",
                  marginLeft: "40px",
                  border: "1px solid #CFC781 ",
                  justifyContent: "space-around",
                }}>
                <Cloumn>
                  {item.change_status == true && (
                    <Tag fontSize='14px'>已交換</Tag>
                  )}
                  {item.change_status == false && (
                    <Tag bgc='#426765' color='white' fontSize='14px'>
                      可交換
                    </Tag>
                  )}
                  <ImgWrap width='230px' height='200px' m='10px 0px 0px 0px'>
                    <Img src={item.picture} width='120%' />
                  </ImgWrap>
                  <Font m=' 10px 0px 0px 0px'> {item.name}</Font>
                  <Hr width='100%'></Hr>
                  {item.change_status == false ? (
                    <>
                      <Font fontSize='16px' color='#CFC781'>
                        希望交換的物品
                      </Font>
                      <Font fontSize='16px'> {item.hope}</Font>
                    </>
                  ) : (
                    <Font fontSize='14px'>
                      已和{item.buyer_name}交換{item.change_supplies}
                    </Font>
                  )}

                  {item.seller_id !== current_userId ? (
                    <Button
                      width='200px'
                      height='30px'
                      fontSize='14px'
                      ml='10px'
                      mt='10px'
                      onClick={() => {
                        changeInvite(index);
                      }}>
                      {item.change_status == false ? "提出交換邀請" : "已交換"}
                    </Button>
                  ) : (
                    <></>
                  )}
                </Cloumn>
              </Box>
            ))}
          </Display>
        )}
      </Display>
      <Display>
        {showBuyerSection && (
          <>
            <Box
              sx={{
                width: "85%",
                height: "280px",
                boxShadow:
                  "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
                borderRadius: 6,
                padding: 5,
                margin: "auto",
                marginTop: "60px",
                marginLeft: "40px",
                border: "1px solid #CFC781 ",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Font>你目前可以交換的物品</Font>
              <Font fontSize='14px'>點選你想交換的物品吧～</Font>
              <br />
              <Display>
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
              </Display>
              <Collapse in={alertOpen}>
                <Alert
                  action={
                    <IconButton
                      aria-label='close'
                      color='inherit'
                      size='small'
                      onClick={() => {
                        setAlertOpen(false);
                      }}>
                      <CloseIcon fontSize='inherit' />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}>
                  已送出
                </Alert>
              </Collapse>
              <br />

              <Button width='200px' mt='20px' onClick={comfirmChange}>
                確認提出交換邀請
              </Button>
            </Box>
          </>
        )}
      </Display>

      {userId === current_userId && (
        <Box
          sx={{
            width: "85%",
            height: "auto",
            boxShadow:
              "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
            borderRadius: 6,
            padding: 5,
            margin: "auto",
            marginTop: "60px",
            border: "1px solid #CFC781 ",
            justifyContent: "space-around",
          }}>
          <Wrap justifyContent='space-around' alignItems='start' width='100%'>
            <Wrap
              direction='column'
              width='100%'
              alignItems='center'
              justifyContent='center'>
              <FileLabel>
                上傳照片
                <FileInput
                  required
                  type='file'
                  accept='image/*'
                  onChange={handleFiles}></FileInput>
              </FileLabel>
              {!upload.file && <DefaultPriviewImgWrap></DefaultPriviewImgWrap>}

              {upload.file && (
                <PriviewImgWrap>
                  <PriviewImg src={suppliesInfo.picture}></PriviewImg>
                </PriviewImgWrap>
              )}
            </Wrap>
            <Wrap alignItems='center' direction='column' width='100%'>
              <br />
              <TextField
                size='small'
                sx={{ width: "70%", marginBottom: "30px" }}
                label='交換物品名稱'
                name='name'
                required
                value={suppliesInfo.name}
                onChange={handleChange}></TextField>
              <br />
              <TextField
                size='small'
                sx={{ width: "70%", marginBottom: "30px" }}
                label='希望交換的類型'
                name='hope'
                required
                value={suppliesInfo.hope}
                onChange={handleChange}></TextField>
              <br />
              <TextField
                size='small'
                sx={{ width: "70%", marginBottom: "30px" }}
                label='狀態'
                name='note'
                required
                value={suppliesInfo.note}
                onChange={handleChange}></TextField>
              <br />
            </Wrap>
          </Wrap>
          <Button onClick={addNewSecondHandSupplies} width='150px'>
            上架二手用品
          </Button>
        </Box>
      )}
    </>
  );
}

export default SecondHand;
