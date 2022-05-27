import { UserContext } from "../utils/userContext";
import styled from "styled-components";
import {
  Cloumn,
  Button,
  Wrap,
  Img,
  Font,
  ImgWrap,
  Hr,
  Tag,
  allSecondHandSuppliesByProfile,
} from "../css/style";
import React, { useState, useEffect, useContext } from "react";
import { TextField, Box } from "@mui/material";
import { updateDoc, doc, arrayUnion, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "../utils/firebaseConfig";
import { db } from "../utils/firebase";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { v4 as uuidv4 } from "uuid";

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
  @media (max-width: 420px) {
    width: 95%;
  }
`;

const SuppliesWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: 70px;
  @media (max-width: 1080px) {
    justify-content: start;
    margin-right: 30px;
  }
  @media (max-width: 765px) {
    justify-content: start;
    margin-right: 0px;
  }
`;

const UploadSecondSuppliesWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  @media (max-width: 900px) {
    flex-direction: column;
  }
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

const letChosenSuppliesAddBorder = (index, buyerArr) => {
  buyerArr.map((item) => {
    {
      item.border = "none";
    }
  });
  buyerArr[index].border = "3px solid #CFC781";
};


const changeSuppliesArrFromBuyer = (data) => {
  let buyerArr = [];
  data.second_hand.map((item) => {
    if (item.change_status == false) {
      buyerArr.push(item);
    }
  });
  return buyerArr;
};

function SecondHand({ userName, userId }) {
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
    waiting_reply: false,
  });
  const [allSupplies, setAllSupplies] = useState([]);
  const [showBuyerSection, setShowBuyerSection] = useState(false);
  const [buyerArr, setBuyerArr] = useState([]);
  const [choseSupplies, setChoseSupplies] = useState("");
  const [inviteIndex, setInviteIndex] = useState("");
  const [buyerIndex, setBuyerIndex] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const Context = useContext(UserContext);

  let buyerId = Context.userId;
  let buyerName = userName;

  const handleFiles = (e) => {
    setUpLoadFile((prevState) => ({ ...prevState, file: e.target.files[0] }));
  };

  useEffect(() => {
    if (userId) {
      onSnapshot(doc(db, "joinGroup", userId), (doc) => {
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
            setSuppliesInfo((prevState) => ({
              ...prevState,
              picture: url,
              supplies_id: uuidv4(),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuppliesInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewSecondHandSupplies = async (event) => {
    event.preventDefault();
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

  const changeInvite = (index) => {
    firebase.getDocJoinGroupOfMember(buyerId).then((res) => {
      setBuyerArr(changeSuppliesArrFromBuyer(res));
    });
    setShowBuyerSection(true);
    setInviteIndex(index);
  };

  const choseSuppliesToChange = (index) => {
    letChosenSuppliesAddBorder(index, buyerArr);
    setBuyerIndex(index);
    setChoseSupplies(buyerArr[index]);
    allSupplies[inviteIndex].inviteSupplies_index = index;
  };

  const updateSecondHandBySeller = async (data, index) => {
    data[index].buyer_name = buyerName;
    data[index].buyer_id = buyerId;
    data[index].change_status = false;
    data[index].change_supplies = choseSupplies.name;
    data[index].change_supplies_picture = choseSupplies.picture;
    data[index].change_note = choseSupplies.note;
    data[index].change_supplies_id = choseSupplies.supplies_id;
    data[index].invite = true;

    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: allSupplies });
  };


  const comfirmChange = async () => {
    setAlertOpen(true);
    updateSecondHandBySeller(allSupplies, inviteIndex);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "已送出邀請",
      showConfirmButton: false,
      timer: 1000,
    });
    setShowBuyerSection(false);
  };

  function GetStatus({ item }) {
    return (
      <>
        {item.waiting_reply == true ? (
          "等待回覆中"
        ) : (
          <> {!item.change_status ? "提出交換邀請" : "已交換"}</>
        )}
      </>
    );
  }

  return (
    <>
      {allSupplies.length !== 0 ? (
        <SuppliesWrap>
          {allSupplies.map((item, index) => (
            <Box sx={allSecondHandSuppliesByProfile}>
              <Cloumn>
                {item.change_status === true && (
                  <Tag fontSize='14px'>已交換</Tag>
                )}
                {item.change_status == false && (
                  <Tag bgc='#426765' color='white' fontSize='14px'>
                    可交換
                  </Tag>
                )}
                <ImgWrap width='100%' height='200px' mt='10px'>
                  <Img src={item.picture} width='120%' />
                </ImgWrap>
                <Font mt='10px'> {item.name}</Font>
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
              </Cloumn>
              {item.seller_id !== Context.userId && (
                <Button
                  width='200px'
                  height='30px'
                  fontSize='14px'
                  mt='10px'
                  onClick={() => {
                    console.log(item.change_status);
                    if (item.change_status === true) return;
                    changeInvite(index);
                  }}>
                  <GetStatus item={item} />
                </Button>
              )}
            </Box>
          ))}
        </SuppliesWrap>
      ) : (
        <Wrap width='100%' justifyContent='center' m='30px 0px 0px 0px'>
          <Font>尚未上架二手露營用品</Font>
        </Wrap>
      )}
      {showBuyerSection && (
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
                    onClick={() => {
                      choseSuppliesToChange(index);
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
      )}

      {userId === Context.userId && (
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
            "@media (max-width: 470px)": {
              padding: "10px",
            },
          }}>
          <UploadSecondSuppliesWrap>
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
                sx={{
                  width: "70%",
                  marginBottom: "30px",
                  "@media (max-width: 470px)": {
                    marginBottom: "10px",
                  },
                }}
                label='交換物品名稱'
                name='name'
                required
                value={suppliesInfo.name}
                onChange={handleChange}></TextField>
              <br />
              <TextField
                size='small'
                sx={{
                  width: "70%",
                  marginBottom: "30px",
                  "@media (max-width: 470px)": {
                    marginBottom: "10px",
                  },
                }}
                label='希望交換的類型'
                name='hope'
                required
                value={suppliesInfo.hope}
                onChange={handleChange}></TextField>
              <br />
              <TextField
                size='small'
                sx={{
                  width: "70%",
                  marginBottom: "30px",
                  "@media (max-width: 470px)": {
                    marginBottom: "10px",
                  },
                }}
                label='狀態'
                name='note'
                required
                value={suppliesInfo.note}
                onChange={handleChange}></TextField>
              <br />
            </Wrap>
          </UploadSecondSuppliesWrap>
          <Button onClick={addNewSecondHandSupplies} width='150px'>
            上架二手用品
          </Button>
        </Box>
      )}
    </>
  );
}

export default SecondHand;
